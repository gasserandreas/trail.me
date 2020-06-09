/* eslint-disable max-len */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    maxWidth: '60%',
    maxHeight: '60%',
    overflow: 'scroll',
  },
}));

export default function TransitionsModal() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Link onClick={handleOpen}>Data privacy</Link>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <Typography variant="h2" gutterBottom>Datenschutz</Typography>
            <Typography variant="h3">Wer sind wir?</Typography>
            <Typography>
              Diese Webseite und deren Inhalt wird durch eine private Person ohne kommerzielle Interessen zur Verfügung gestellt.
              Verantwortliche Stelle im Sinne der Datenschutzgesetze, insbesondere der EU-Datenschutzgrundverordnung (DSGVO), lautet:
              <br />
              <br />
              Andreas Gasser
              <br />
              Gänsacker 1
              <br />
              5070 Frick
              <br />
              E-Mail: hello@andreasgasser.com
              <br />
              Webseite:
              {' '}
              <Link to="https://andreasgasser.com">andreasgasser.com</Link>
              <br />
              <br />
            </Typography>
            <Typography variant="h3">Welche personenbezogenen Daten wir sammeln und warum wir sie sammeln?</Typography>
            <Typography>
              Wenn Sie auf diese Webseite zugreifen werden automatisch Informationen allgemeiner Natur erfasst. Diese Informationen werden im Server-Logfile erfasst und beinhalten die Art des Webbrowsers, das verwendete Betriebssystem, den Domainnamen Ihres Internet-Service-Providers, Ihre IP-Adresse und ähnliches.
              Dies aus folgendem Grund:
              <ul>
                <li>Sicherstellung eines problemlosen Verbindungsaufbaus der Website</li>
                <li>Sicherstellung einer reibungslosen Nutzung unserer Website</li>
                <li>Auswertung der Systemsicherheit und -stabilität sowie</li>
                <li>zu weiteren administrativen Zwecken</li>
              </ul>
              Ihre Daten werden nicht verwendet, um Rückschlüsse auf Ihre Person zu ziehen. Informationen dieser Art werden lediglich statistisch ausgewertet, um unseren Internetauftritt und die dahinterstehende Technik zu optimieren.
              <br />
              <br />
            </Typography>
            <Typography variant="h3">Speicherdauer</Typography>
            <Typography>
              Die Daten werden gelöscht, sobald diese für den Zweck der Erhebung nicht mehr erforderlich sind. Dies ist für die Daten, die der Bereitstellung der Webseite dienen, grundsätzlich der Fall, wenn die jeweilige Sitzung beendet ist.
              <br />
              <br />
            </Typography>
            <Typography variant="h3">Verwendung von Scriptbibliotheken (Google Webfonts)</Typography>
            <Typography>
              Um unsere Inhalte browserübergreifend korrekt und grafisch ansprechend darzustellen, verwenden wir auf dieser Website „Google Web Fonts“ der Google LLC (1600 Amphitheatre Parkway, Mountain View, CA 94043, USA; nachfolgend „Google“) zur Darstellung von Schriften.
              Die Datenschutzrichtlinie des Bibliothekbetreibers Google finden Sie hier:
              {' '}
              <Link to="https://www.google.com/policies/privacy/">https://www.google.com/policies/privacy/</Link>
              <br />
              <br />
            </Typography>
            <Typography variant="h3">Eingebettete Inhalte von anderen Websites</Typography>
            <Typography>
              Beiträge auf dieser Website können eingebettete Inhalte beinhalten (z. B. Videos, Bilder, Beiträge etc.). Eingebettete Inhalte von anderen Websites verhalten sich exakt so, als ob der Besucher die andere Website besucht hätte.
              Diese Websites können Daten über Sie sammeln, Cookies benutzen, zusätzliche Tracking-Dienste von Dritten einbetten und Ihre Interaktion mit diesem eingebetteten Inhalt aufzeichnen, inklusive Ihrer Interaktion mit dem eingebetteten Inhalt, falls Sie ein Konto haben und auf dieser Website angemeldet sind.
              <br />
              <br />
            </Typography>
            <Typography variant="h3">Verwendung von Google Analytics</Typography>
            <Typography>
              Diese Website benutzt Google Analytics, einen Webanalysedienst der Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043 USA (nachfolgend: „Google“). Google Analytics verwendet sog. „Cookies“, also Textdateien, die auf Ihrem Computer gespeichert werden und die eine Analyse der Benutzung der Webseite durch Sie ermöglichen. Die durch das Cookie erzeugten Informationen über Ihre Benutzung dieser Webseite werden in der Regel an einen Server von Google in den USA übertragen und dort gespeichert. Aufgrund der Aktivierung der IP-Anonymisierung auf diesen Webseiten, wird Ihre IP-Adresse von Google jedoch innerhalb von Mitgliedstaaten der Europäischen Union oder in anderen Vertragsstaaten des Abkommens über den Europäischen Wirtschaftsraum zuvor gekürzt. Nur in Ausnahmefällen wird die volle IP-Adresse an einen Server von Google in den USA übertragen und dort gekürzt. Im Auftrag des Betreibers dieser Website wird Google diese Informationen benutzen, um Ihre Nutzung der Webseite auszuwerten, um Reports über die Webseitenaktivitäten zusammenzustellen und um weitere mit der Websitenutzung und der Internetnutzung verbundene Dienstleistungen gegenüber dem Webseitenbetreiber zu erbringen. Die im Rahmen von Google Analytics von Ihrem Browser übermittelte IP-Adresse wird nicht mit anderen Daten von Google zusammengeführt.
              Die Zwecke der Datenverarbeitung liegen in der Auswertung der Nutzung der Website und in der Zusammenstellung von Reports über Aktivitäten auf der Website. Auf Grundlage der Nutzung der Website und des Internets sollen dann weitere verbundene Dienstleistungen erbracht werden.
              <br />
              <br />
            </Typography>
            <Typography variant="h3">Kontakt-Informationen</Typography>
            <Typography>
              Für datenschutzrelevante Anliegen wenden Sie sich bitte an:
              <br />
              <br />
              Andreas Gasser
              <br />
              Gänsacker 1
              <br />
              5070 Frick
              <br />
              E-Mail: hello@andreasgasser.com
              <br />
              <br />
            </Typography>
            <Typography variant="h3" gutterBottom>Wie wir Ihre Daten schützen</Typography>
            <Typography variant="h4">SSL-Verschlüsselung</Typography>
            <Typography>
              Um die Sicherheit Ihrer Daten bei der Übertragung zu schützen, verwenden wir dem aktuellen Stand der Technik entsprechende Verschlüsselungsverfahren (z. B. SSL) über HTTPS.
            </Typography>
            <Typography variant="h4">Änderungen</Typography>
            <Typography>
              Wir können diese Datenschutzerklärung jederzeit ohne Vorankündigung anpassen. Es gilt die jeweils aktuelle, auf unserer Website publizierte Fassung.
            </Typography>
            <Typography variant="h4">Fragen an den Datenschutzbeauftragten</Typography>
            <Typography>
              Wenn Sie Fragen zum Datenschutz haben, schreiben Sie uns bitte eine E-Mail oder wenden Sie sich direkt an die für den Datenschutz zu Beginn der Datenschutzerklärung aufgeführten, verantwortlichen Person.
              <br />
              Frick, 06.06.2020
            </Typography>
            <br />
            <Button variant="contained" color="primary" onClick={handleClose}>
              Close
            </Button>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
