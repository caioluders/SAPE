import sys , requests
from PySide2.QtCore import *
from PySide2.QtGui import *
from PySide2.QtWidgets import *

class SettingsPage(QWidget) :
	def __init__(self) :
		QWidget.__init__(self)

	def paintEvent(self, e):
		dc = QPainter(self)
		dc.drawLine(0,0,100,100)
		dc.drawLine(100,0,0,100)

class SAPE(QMainWindow):
	def __init__(self):
		super(SAPE, self).__init__()
		self.setWindowTitle("SAPE - Software Assisted Poetry Editor")
		self.setWindowFlags(Qt.FramelessWindowHint)
		self.resize(475, 253)
		self.actionOpen = QAction(self)
		self.actionOpen.setObjectName(u"actionOpen")
		self.actionExit = QAction(self)
		self.actionExit.setObjectName(u"actionExit")
		self.actionSave = QAction(self)
		self.actionSave.setObjectName(u"actionSave")	
		self.close_button = QPushButton("X")	
		self.close_button.clicked.connect(lambda _: [self.close_button.hide(),self.rhymes_box.hide()])

		self.text_edit = QTextEdit()
		self.text_edit.setContextMenuPolicy(Qt.CustomContextMenu)
		self.text_edit.installEventFilter(self)
		self.text_edit.textChanged.connect(self.add_syllabes)

		self.syllabes_count = QTextEdit()
		sizePolicy1 = QSizePolicy(QSizePolicy.Minimum, QSizePolicy.Minimum)
		sizePolicy1.setHorizontalStretch(0)
		sizePolicy1.setVerticalStretch(0)
		sizePolicy1.setHeightForWidth(self.syllabes_count.sizePolicy().hasHeightForWidth())
		self.syllabes_count.setSizePolicy(sizePolicy1)
		self.syllabes_count.setMinimumSize(QSize(50,16777215))
		self.syllabes_count.setMaximumSize(QSize(50, 16777215))
		self.syllabes_count.setContextMenuPolicy(Qt.CustomContextMenu)
		self.syllabes_count.setReadOnly(True)
		self.syllabes_count.setVerticalScrollBarPolicy(Qt.ScrollBarAlwaysOff)
		self.rhymes_box = QListWidget()	
		self.rhymes_box.itemClicked.connect(self.rhyme_clicked)

		self.text_edit.horizontalScrollBar().valueChanged.connect(self.syllabes_count.horizontalScrollBar().setValue)
		self.syllabes_count.horizontalScrollBar().valueChanged.connect(self.text_edit.horizontalScrollBar().setValue)

		self.clipboard = QGuiApplication.clipboard()

		central_widget = QWidget()
		self.setCentralWidget(central_widget)
		self.grid_layout = QGridLayout(central_widget)
		self.grid_layout.addWidget(self.syllabes_count,0,0,1,1)
		self.grid_layout.addWidget(self.text_edit,0,1,-1,1 )


		


		self.settings_popup = None

		self.connect(self.text_edit,SIGNAL('customContextMenuRequested(const QPoint &)'), self.context_menu)

	#def eventFilter(self, obj, event):
		#if event.type() == QtCore.QEvent.KeyPress and obj is self.text_edit:
			#if self.text_edit.hasFocus():
				#self.add_syllabes()
			#return super().eventFilter(obj, event)

	def add_syllabes(self) :
		poem = self.text_edit.toPlainText().split("\n")
		syllabes_text = ""


		for p in range(len(poem)) :
			syllabes_text += str(p)+"\n"	

		self.syllabes_count.setPlainText(syllabes_text)

	def context_menu(self) :
		menu = QMenu(self)
		rhymeAction = QAction("Procurar rima", self)
		rhymeAction.triggered.connect(self.find_rhyme)
		settingsAction = QAction("Preferencias", self)
		settingsAction.triggered.connect(self.show_settings)
		menu.addAction(rhymeAction)
		menu.addAction(settingsAction)
		menu.exec_(QCursor.pos())

	def find_rhyme( self ) :
		API_URL = "https://api.dicionario-aberto.net/suffix/"
		selected_word = self.text_edit.textCursor().selectedText()
		if len(selected_word) < 3 :
			return 
		rhymes = [ x["word"] for x in requests.get(API_URL+selected_word[-3:]).json() ]
		self.rhymes_box.clear()
		self.rhymes_box.addItems(rhymes)

		self.rhymes_box.show()
		self.close_button.show()

		self.grid_layout.addWidget(self.close_button,0,5,1,1)
		self.grid_layout.addWidget(self.rhymes_box,1,5,1,4)

	def rhyme_clicked( self, item ) :
		self.clipboard.setText(str(item.text()))

	def show_settings(self) :
		self.settings_popup = SettingsPage()
		self.settings_popup.setGeometry(QRect(100,100,400,200))
		self.settings_popup.show()

if __name__ == "__main__":
	app = QApplication(sys.argv)

	file = QFile("./dark.qss")
	file.open(QFile.ReadOnly | QFile.Text)
	stream = QTextStream(file)
	app.setStyleSheet(stream.readAll())

	sape = SAPE()
	sape.show()
	sys.exit(app.exec_())
