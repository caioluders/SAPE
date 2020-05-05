import sys , requests
from PySide2.QtWidgets import (
    QMainWindow,
    QApplication,
    QLineEdit,
    QPushButton,
    QTextEdit,
    QGridLayout,
    QWidget,
		QMenu,
		QAction,
		QListWidget
)
from PySide2.QtGui import QTextCursor, QCursor, QGuiApplication, QPainter
from PySide2 import QtCore, QtGui

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
		self.setWindowFlags(QtCore.Qt.FramelessWindowHint)
		self.resize(475, 253)
	
		self.close_button = QPushButton("X")	
		self.close_button.clicked.connect(lambda _: [self.close_button.hide(),self.rhymes_box.hide()])

		self.text_edit = QTextEdit()
		self.text_edit.setContextMenuPolicy(QtCore.Qt.CustomContextMenu)

		self.rhymes_box = QListWidget()	
		self.rhymes_box.itemClicked.connect(self.rhyme_clicked)

		self.clipboard = QGuiApplication.clipboard()

		central_widget = QWidget()
		self.setCentralWidget(central_widget)
		self.grid_layout = QGridLayout(central_widget)
		self.grid_layout.addWidget(self.text_edit, 0,0,0,0)

		self.settings_popup = None

		self.connect(self.text_edit, QtCore.SIGNAL('customContextMenuRequested(const QPoint &)'), self.context_menu)

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
		self.settings_popup.setGeometry(QtCore.QRect(100,100,400,200))
		self.settings_popup.show()

if __name__ == "__main__":
	app = QApplication(sys.argv)
	sape = SAPE()
	sape.show()
	sys.exit(app.exec_())
