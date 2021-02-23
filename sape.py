import sys , requests, random
from PySide2.QtCore import *
from PySide2.QtGui import *
from PySide2.QtWidgets import *
from g2p.g2p import G2PTranscriber

rhymes_highlight = {}

# https://build-system.fman.io/

def findall(p, s):
	'''Yields all the positions of
	the pattern p in the string s.'''
	i = s.find(p)
	while i != -1:
		yield i
		i = s.find(p, i+1)

class SettingsPage(QWidget) :

	def __init__(self) :
		QWidget.__init__(self)
		self.settings = QSettings("SAPE","SAPE")

	def getfont(self) :
		ok, font = QFontDialog.getFont() 

		if ok :
			self.settings.setValue("Font",font)
			temp_text = sape.text_edit.toPlainText()
			sape.text_edit.clear()
			sape.text_edit.setCurrentFont(font)
			sape.text_edit.insertPlainText(temp_text)

	def rhymes_highlight_changed(self):
		self.settings.setValue("Highlight",self.rhymes_highlight.checkState())

	def rhymes_box_value(self, i) :
		self.settings.setValue("Rhymes",i+3)

	def paintEvent(self, e):
		layout = QVBoxLayout()

		self.font_picker = QPushButton("Escolher fonte")
		self.font_picker.clicked.connect(self.getfont)		
		layout.addWidget(self.font_picker)

		self.rhymes_highlight = QCheckBox("Destacar rimas",self)
		self.rhymes_highlight.stateChanged.connect(self.rhymes_highlight_changed)
		layout.addWidget(self.rhymes_highlight)

		self.rhymes_label = QLabel("Procurar rimas pelo menos")
		layout.addWidget(self.rhymes_label)

		self.rhymes_box = QComboBox()
		self.rhymes_box.addItems(["3","4","5","6"])
		self.rhymes_box.setCurrentIndex(self.settings.value("Rhymes")-3)
		self.rhymes_box.currentIndexChanged.connect(self.rhymes_box_value)
		layout.addWidget(self.rhymes_box)
		

		self.setLayout(layout)

class MyHighlighter( QSyntaxHighlighter ):

	def __init__( self, parent, theme ):
		QSyntaxHighlighter.__init__( self, parent )
		self.parent = parent
		keyword = QTextCharFormat()

		self.highlightingRules = []

	  # keyword
		brush = QBrush( Qt.darkBlue, Qt.SolidPattern )
		keyword.setForeground( brush )
		keyword.setFontWeight( QFont.Bold )
		keywords = rhymes_highlight

		for word in keywords:
			pattern = word
			rule = HighlightingRule( pattern, keyword )
			self.highlightingRules.append( rule )

	def highlightBlock( self, text ):
		for rule in rhymes_highlight.values() :
			expression = rule.pattern 
			index = findall(expression,text)
			length = len(expression)
			for m in index : 
				self.setFormat( m, length, rule.format )
		self.setCurrentBlockState( 0 )

class HighlightingRule():
	def __init__( self, pattern, format ):
		self.pattern = pattern
		self.format = format

class SAPE(QMainWindow):
	def __init__(self):
		super(SAPE, self).__init__()
		self.setWindowTitle("SAPE - Software Assisted Poetry Editor")
		#self.setWindowFlags(Qt.FramelessWindowHint) # it bugs on MacOS
		self.resize(475, 253)
		
		self.close_button = QPushButton("X")	
		self.close_button.clicked.connect(lambda _: [self.close_button.hide(),self.rhymes_box.hide()])
		self.close_button.setMaximumSize(QSize(35,35))


		self.settings = QSettings("SAPE","SAPE")

		if self.settings.value("Highlight") == None :
			self.settings.setValue("Highlight",True)
		if self.settings.value("Rhymes") == None :
			self.settings.setValue("Rhymes",3)
		if self.settings.value("Font") == None :
			self.settings.setValue("Font",QFont("Helvetica", 12))

		self.text_edit = QTextEdit()
		self.text_edit.setContextMenuPolicy(Qt.CustomContextMenu)
		self.text_edit.installEventFilter(self)
		self.text_edit.textChanged.connect(self.add_syllabes)

		highlither = MyHighlighter( self.text_edit, "Classic" )
		
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
		self.rhymes_box.setMinimumSize(QSize(200,16777215))
		self.rhymes_box.setMaximumSize(QSize(200,16777215))

		self.text_edit.horizontalScrollBar().valueChanged.connect(self.syllabes_count.horizontalScrollBar().setValue) # trying to sync scrollbars
		self.syllabes_count.horizontalScrollBar().valueChanged.connect(self.text_edit.horizontalScrollBar().setValue)

		self.clipboard = QGuiApplication.clipboard()

		central_widget = QWidget()
		self.setCentralWidget(central_widget)
		self.grid_layout = QGridLayout(central_widget)
		self.grid_layout.addWidget(self.syllabes_count,0,0,1,1)
		self.grid_layout.addWidget(self.text_edit,0,1,1,1 )


		self.fname = None

		self.settings_popup = None

		self.connect(self.text_edit,SIGNAL('customContextMenuRequested(const QPoint &)'), self.context_menu)

	def add_syllabes(self) :
		poem = self.text_edit.toPlainText()
		poem_lines = poem.split("\n")
		syllabes_text = ""

		global rhymes_highlight
		syllables_list = []

		for pl in poem_lines :
		    pl_n = 0
		    for w in pl.split(" ") : 
			    
			    w_phonetic = G2PTranscriber(w.encode("utf-8").lower(), algorithm="ceci")
			    w_syllables = w_phonetic.get_syllables()
			    w_syllables_phonetic = w_phonetic.transcriber()
			    print(rhymes_highlight)
			    pl_n += len(w_syllables)
			    for si in range(0,len(w_syllables)) : 
				    if len(w_syllables[si]) >= 2 :
					    if (w_syllables[si] not in rhymes_highlight.keys()) :
						    keyword = QTextCharFormat()
						    brush = QBrush( random.choice([ Qt.red , Qt.darkRed , Qt.green , Qt.darkGreen , Qt.blue , Qt.darkBlue , Qt.cyan , Qt.darkCyan , Qt.magenta , Qt.darkMagenta , Qt.yellow , Qt.darkYellow , Qt.gray , Qt.darkGray , Qt.lightGray]), Qt.SolidPattern )
						    keyword.setBackground( brush )

						    rule = HighlightingRule( w_syllables[si], keyword )
						    rhymes_highlight[ w_syllables[si] ] = rule
		    syllables_list.append(pl_n)

		for p in syllables_list :
			syllabes_text += str(p)+"\n"	

		self.syllabes_count.setPlainText(syllabes_text)

	def context_menu(self) :
		menu = QMenu(self)
		openAction = QAction("Abrir",self)
		openAction.triggered.connect(self.open_file)
		saveAction = QAction("Salvar",self)
		saveAction.triggered.connect(self.save_file)
		rhymeAction = QAction("Procurar rima", self)
		rhymeAction.triggered.connect(self.find_rhyme)
		settingsAction = QAction("Preferências", self)
		settingsAction.triggered.connect(self.show_settings)
		menu.addAction(openAction)
		menu.addAction(saveAction)
		menu.addAction(rhymeAction)
		menu.addAction(settingsAction)
		menu.exec_(QCursor.pos())

	def find_rhyme( self ) :
		API_URL = "https://api.dicionario-aberto.net/suffix/"
		selected_word = self.text_edit.textCursor().selectedText()
		if len(selected_word) < 3 :
			return 
		suffix_size = self.settings.value("Rhymes")
		print(suffix_size)
		rhymes = [ x["word"] for x in requests.get(API_URL+selected_word[-suffix_size:]).json() ]
		self.rhymes_box.clear()
		self.rhymes_box.addItems(rhymes)

		self.rhymes_box.show()
		self.close_button.show()

		self.grid_layout.addWidget(self.rhymes_box,0,3,1,1)
		self.grid_layout.addWidget(self.close_button,0,3,1,1)

	def rhyme_clicked( self, item ) :
		self.clipboard.setText(str(item.text()))

	def show_settings(self) :
		self.settings_popup = SettingsPage()
		self.settings_popup.setGeometry(QRect(100,100,400,200))
		self.settings_popup.show()

	def open_file(self) :
		self.fname = QFileDialog.getOpenFileName(self,'Abrir','/')
		f = open(self.fname[0],'r')
		with f :
			data = f.read()
			self.text_edit.setText(data)

	def save_file(self) :
		fw = open(self.fname[0],'w')
		with fw :
			fw.write(self.text_edit.toPlainText())

if __name__ == "__main__":
	app = QApplication(sys.argv)

	file = QFile("./dark.qss")
	file.open(QFile.ReadOnly | QFile.Text)
	stream = QTextStream(file)
	app.setStyleSheet(stream.readAll())

	global sape
	sape = SAPE()
	sape.show()
	sys.exit(app.exec_())
