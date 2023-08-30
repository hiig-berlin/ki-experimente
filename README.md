# ki-experimente

Experimente zu Facial-Detection und Facial-Recognition als Teil des Forschungsprojekts [Künstliche Intelligenz, menschlich erklärt](https://www.hiig.de/project/ki-menschlich-erklaert/).

Diese Webseite gibt einen Einblick in die Welt der Künstlichen Intelligenz rund um das Thema Gesichtserkennung. Zwei Experimente zu Facial-Detection und Facial-Recognition wurden im Rahmen des des Forschungsprojekts *Künstliche Intelligenz, menschlich erklärt* entwickelt. Dieses Projekt wurde in Kooperation zwischen dem Alexander von Humboldt Institut für Internet und Gesellschaft (HIIG) und der gemeinnützigen Organisation neuland & gestalten durchgeführt und von der Entwicklerin Esther Weidauer umgesetzt.

## Zweck und Datenverarbeitung

Das Projekt möchte grundlegendes Wissen über Künstliche Intelligenz am Beispiel der Gesichtserkennung zugänglich machen. Persönlichen Daten werden hier nicht gespeichert, die Nutzung der Systeme funktioniert lokal und wird auf dem Rechner oder dem Handy abgelegt und gelöscht, sobald der Browser geschlossen wird.

# Installation und Entwicklung

## Server-Voraussetzungen

- SSL/HTTPS (sonst funktioniert der Kamera-Zugriff nicht)

## Automatischer Build

Die Seite wird bei jedem Git-Tag der das Format `"v*"` hat (also z.B. `"v1.0"`) automatisch durch einen Github-Workflow generiert.

Der Fortschritt kann unter <https://github.com/hiig-berlin/ki-experimente/actions> eingesehen werden. Der Prozess dauert normalerweise nur ein paar Sekunden.

Danach kann hier eine Zip-Datei mit der fertigen Seite herunter geladen werden: <https://github.com/hiig-berlin/ki-experimente/releases/download/latest/site.zip>. Die Datei enthält ein Verzeichnis dessen Inhalt dann auf den jeweiligen Webserver hochgeladen werden kann.

## Lokaler Build

(z.B. für weitere Entwicklung oder Erweiterung der Seite)

### Voraussetzungen

- node.js, 18 LTS oder neuer
- NPM (in node.js enthalten)


### Seite kompilieren

Im Hauptverzeichnis de Projekts:

- `npm install` (muss nur einmal ausgeführt werden um benötigte Bibliotheken zu installieren)
- `npm run build`

Danach befindet sich die Website im `output` Verzeichnis und kann von dort auf einen Webserver hochgeladen werden.

Um die Seite lokal zu testen wird ein Webserver benötigt der SSL-Verschlüsselung anbietet sowie ein SSL-Zertifikat.
