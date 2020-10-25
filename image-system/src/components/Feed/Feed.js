import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { axiosConfig, baseUrl } from '../../utils/variables';
import useProtectedRoute from '../../hooks/useProtectedRoute';

import AppContext from '../../context/AppContext';
import { ModalImage } from '../ModalImage/ModalImage';

import { Container } from '../../styles/main';
import { Gallery } from './style/style';


export const Feed = () => {
    const appContext = useContext(AppContext);
    const [ requestMessage, setRequestMessage ] = useState("");
    const [ openImage, setOpenImage ] = useState(false);
    const token = useProtectedRoute();

    const handleOpenImage = id => {
        setOpenImage(!openImage);
        getImageInfo(id)
    }

    const getImages = async() => {
        try {
            const response = await axios.get(`${baseUrl}/user/feed`, axiosConfig(token))
            appContext.dispatch({ type: "GET_IMAGES", images: response.data.image });
            setRequestMessage("")
        } catch(err) {
            if(err.message === "Request failed with status code 400") {
                setRequestMessage("No image found.")
            } else {
                setRequestMessage(err.message)
            }
        }
    }

    const getImageInfo = async(id) => {
        try {
            const response = await axios.get(`${baseUrl}/images/${id}`, axiosConfig(token))

            appContext.dispatch({ type: "GET_ACTIVE_IMAGE", activeImage: response.data.image });

        } catch(err) {
            console.log(err.message)
        }
    }

    useEffect(() => {
        getImages();
    }, [])

  return (
    <Container>
        <h4>{requestMessage}</h4>
        <Gallery>
            {appContext && appContext.images && appContext.images.length !== 0 && appContext.images.map( image => {
                return <div key={image.id} onClick={() => handleOpenImage(image.id)}>
                    <img src={image.file} alt={image.subtitle} />
                    <p>{image.subtitle}</p>
                </div>
            })}
        </Gallery>
        {openImage && appContext.activeImage && <ModalImage file={appContext.activeImage.file} subtitle={appContext.activeImage.subtitle} author={appContext.activeImage.author} date={appContext.activeImage.date} tags={appContext.activeImage.tags} collection={appContext.activeImage.collection} handleClick={handleOpenImage} />}
    </Container>
  );
}