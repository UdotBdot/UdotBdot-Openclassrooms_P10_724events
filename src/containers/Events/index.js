import { useState } from "react";
import EventCard from "../../components/EventCard";
import Select from "../../components/Select";
import { useData } from "../../contexts/DataContext";
import Modal from "../Modal";
import ModalEvent from "../ModalEvent";

import "./style.css";

const perPage = 9;

const EventList = () => {
  const { data, error } = useData();
  const [type, setType] = useState();
  const [currentPage, setCurrentPage] = useState(1);

  // Calcul de l'indice de début de la pagination
  const startIdx = (currentPage - 1) * perPage;
  // Calcul de l'indice de fin de la pagination
  const endIdx = currentPage * perPage;

  // Filtrage des événements en fonction du type sélectionné
  const filteredEvents =
    (type
      ? data?.events.filter((event) => event.type === type)
      : data?.events) || [];

  // Sélection des événements pour la page actuelle
  const paginatedEvents = filteredEvents.slice(startIdx, endIdx);

  const changeType = (evtType) => {
    // Réinitialisation de la page lorsqu'un nouveau type est sélectionné
    setCurrentPage(1);
    setType(evtType);
  };  

  // Calcul du nombre de pages nécessaires avec Math.ceil
  const pageNumber = Math.ceil(filteredEvents.length / perPage);
  const typeList = new Set(data?.events.map((event) => event.type));

  return (
    <>
      {error && <div>An error occurred</div>}
      {data === null ? (
        "loading"
      ) : (
        <>
          <h3 className="SelectTitle">Catégories</h3>
          <Select
            selection={Array.from(typeList)}
            onChange={(value) => (value ? changeType(value) : changeType(null))}
          />
          <div id="events" className="ListContainer">
            {paginatedEvents.map((event) => (
              <Modal key={event.id} Content={<ModalEvent event={event} />}>
                {({ setIsOpened }) => (
                  <EventCard
                    onClick={() => setIsOpened(true)}
                    imageSrc={event.cover}
                    title={event.title}
                    date={new Date(event.date)}
                    label={event.type}
                  />
                )}
              </Modal>
            ))}
          </div>
          <div className="Pagination">
            {[...Array(pageNumber)].map((_, n) => (
              // eslint-disable-next-line react/no-array-index-key
              <a key={n + 1} href="#events" onClick={() => setCurrentPage(n + 1)}>
                {n + 1}
              </a>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default EventList;
