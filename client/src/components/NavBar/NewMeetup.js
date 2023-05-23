import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './NewMeetup.module.css';


function NewMeetup() {
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState('');
  const [sports, setSports] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [vacancy, setVacancy] = useState(0);
  const [description, setDescription] = useState(null);
  const [error, setError] = useState('');

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const meetup = {title, sports, date, location, vacancy, description};

    const response = await fetch('/api/meetups', {
        method: 'POST',
        body: JSON.stringify(meetup),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    const json = await response.json();

    if (!response.ok) {
        setError(json.error);
    } else {
        setTitle('');
        setSports('');
        setDate('');
        setLocation('');
        setVacancy(0);
        setDescription('');

        console.log('New meetup added!');
        handleClose();
    }
  }

  return (
    <>
      <Button variant="primary" onClick={handleShow} className={styles.primarybutton}>
        Create a Meetup
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size='xl'
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>New Meetup</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form action="" className={styles.form}>
            <label htmlFor="">Title</label>
            <input 
                type="text" 
                onChange={(e) => setTitle(e.target.value)}
                value={title}
            />

            <label htmlFor="">Sports</label>
            <input 
                type="text" 
                onChange={(e) => setSports(e.target.value)}
                value={sports}
            />

            <label htmlFor="">Date</label>
            <input 
                type="text" 
                onChange={(e) => setDate(e.target.value)}
                value={date}
            />

            <label htmlFor="">Location</label>
            <input 
                type="text" 
                onChange={(e) => setLocation(e.target.value)}
                value={location}
            />

            <label htmlFor="">Vacancy</label>
            <input 
                type="text" 
                onChange={(e) => setVacancy(e.target.value)}
                value={vacancy}
            />

            <label htmlFor="">Description</label>
            <input 
                type="text" 
                onChange={(e) => setDescription(e.target.value)}
                value={description}
            />
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" className={styles.primarybutton} onClick={handleSubmit}>Create</Button>
        </Modal.Footer>
        {error && <div>{error}</div>}
      </Modal>
    </>
  );
}

export default NewMeetup;