import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import authAxios from '../../api';
import NavBar from '../../Components/NavBar/NavBar.tsx';
import { useNavigate } from 'react-router-dom';
// import { Title, DeleteButton, TurfsContainer, TurfCard, TurfTitle, TurfImage, NoTurfsMessage } from './update.ts';
import TurfUpdateModal from '../../Components/TurfUpdateModal';
import { DeleteButton, NoTurfsMessage, Title, TurfCard, TurfImage, TurfsContainer, TurfTitle } from '../HisTurf/histurf';

interface Turf {
  id: string;
  name: string;
  price: number;
  ownerId: string;
  image_path: string;
}

const Histurf = () => {
  const [turfs, setTurfs] = useState<Turf[]>([]);
  const [selectedTurf, setSelectedTurf] = useState<Turf | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const s = localStorage.getItem('token');
  const decoded = jwtDecode(s);
  const userid = decoded.sub;

  useEffect(() => {
    getTurfs();
  }, []);

  const getTurfs = async () => {
    try {
      const response = await authAxios.get('/api/user/turf');
      const filteredTurfs = response.data.turfs.filter((t: Turf) => t.ownerId === userid);
      setTurfs(filteredTurfs);
    } catch (error) {
      console.error('Error fetching turfs:', error);
    }
  };

  const deleteturf = async (turfId: string) => {
    if (!window.confirm('Do you want to delete this turf?')) return;

    try {
      await authAxios.delete(`/api/user/${userid}/${turfId}`);
      setTurfs(prevTurfs => prevTurfs.filter(turf => turf.id !== turfId));
    } catch (error) {
      console.error('Error deleting turf:', error);
    }
  };

  const openUpdateModal = (turf: Turf) => {
  console.log("Opening modal for Turf ID:", turf.id); // Debugging log
  setSelectedTurf(turf);
  setIsModalOpen(true);
};


  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTurf(null);
    getTurfs(); 
  };

  return (
    <>
      <NavBar />
      <Title>My Turfs</Title>
      <TurfsContainer>
        {turfs.length > 0 ? (
          turfs.map((turf) => (
            <TurfCard key={turf.id}>
              <TurfTitle>{turf.name}</TurfTitle>
              <TurfImage src={`data:image/jpeg;base64,${turf.image_path}`} alt="" />
              <DeleteButton onClick={() => deleteturf(turf.id)}>Delete</DeleteButton>
              <DeleteButton style={{ backgroundColor: "green" }} onClick={() => openUpdateModal(turf)}>Update</DeleteButton>
            </TurfCard>
          ))
        ) : (
          <NoTurfsMessage>No turfs found.</NoTurfsMessage>
        )}
      </TurfsContainer>

      {isModalOpen && selectedTurf && <TurfUpdateModal turf={selectedTurf} onClose={closeModal} />}
    </>
  );
};

export default Histurf;
