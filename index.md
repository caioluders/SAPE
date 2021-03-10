# SAPE
**Software Assisted Poetry Editor**

![Screenshot](https://i.imgur.com/pS3X3rk.png)

## WTF ?
SAPE is a poetry editor program, basicly a minimalistic text-editor with two main functions : 
* Phonetic Syllable counter
* Rhyme search
* Rhyme highlight

## Installation

### Linux

```
$ git clone https://github.com/caioluders/SAPE.git
$ cd SAPE
$ pip instal -r requiments.txt
$ ./sape.py
```

### Phonetic Syllable counter
It counts the sum of the Phonetic Syllable of each line, helping the poet to adjust the metric of your poem. It's the number before each line.

### Rhyme search
It helps the poet to find words that rime with a desired word. Select the word and press go to "Edit->Rimes" ( Or cmd+R )

### Rhyme search
Highlights every rhyme wihthin the text.

#### ETC
Right now only works with Brazilian Portuguese , and it uses the word database of dicionario-aberto.net
For the syllable counter we're using https://github.com/alessandrobokan/PETRUS
