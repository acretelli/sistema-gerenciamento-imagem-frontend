import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { axiosConfig, baseUrl } from '../../utils/variables';
import useProtectedRoute from '../../hooks/useProtectedRoute';

import AppContext from '../../context/AppContext';
import { ModalCollection } from '../ModalCollection/ModalCollection';

import { Container } from '../../styles/main';
import { Gallery } from './style/style';
import { useHistory } from 'react-router-dom';


export const AllCollections = () => {
    const appContext = useContext(AppContext);
    const [ requestMessage, setRequestMessage ] = useState("");
    const [ openModal, setOpenModal ] = useState(false);
    const token = useProtectedRoute();
    const history = useHistory();

    const handleOpenModal = id => {
        getCollectionInfo(id)
        setOpenModal(!openModal);
    }

    const handleCollection = id => {
        history.push(`/collections/${id}`)
    }

    const getCollections = async() => {
        try {
            const response = await axios.get(`${baseUrl}/collection/all`, axiosConfig(token))
            appContext.dispatch({ type: "GET_COLLECTIONS", collections: response.data.collections });
            console.log(appContext && appContext.collections)
            setRequestMessage("")
        } catch(err) {
            if(err.message === "Request failed with status code 400") {
                setRequestMessage("No collection found.")
            } else {
                setRequestMessage(err.message)
            }
        }
    }

    const getCollectionInfo = async(id) => {
        try {
            const response = await axios.get(`${baseUrl}/collection/${id}`, axiosConfig(token))

            appContext.dispatch({ type: "GET_ACTIVE_COLLECTION", activeCollection: response.data.collection });

        } catch(err) {
            console.log(err.message)
        }
    }

    useEffect(() => {
        getCollections();
    }, [])

  return (
    <Container>
        <h4>{requestMessage}</h4>
        <Gallery>
            {appContext && appContext.collections.length !== 0 && appContext.collections.map( collection => {
                return <div key={collection.id} onClick={() => handleOpenModal(collection.id)}>
                    <img src={collection.image} alt={collection.title} />
                    <p>{collection.title}</p>
                </div>
            })}
        </Gallery>
        {openModal && appContext.activeCollection && <ModalCollection title={appContext.activeCollection.title} subtitle={appContext.activeCollection.subtitle} image={appContext.activeCollection.image} handleClick={() => handleCollection(appContext.activeCollection.id)} />}
    </Container>
  );
}