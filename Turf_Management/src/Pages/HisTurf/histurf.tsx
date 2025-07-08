
import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import authAxios from '../../api';
import NavBar from '../../Components/NavBar/NavBar.tsx';
import { Title, DeleteButton, TurfsContainer, TurfCard, TurfTitle, TurfImage, NoTurfsMessage } from './histurf';
import TurfUpdateModal from '../../Components/TurfUpdateModal';
import CreateTurfModal from '../../Components/CreateModel';


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
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const token = localStorage.getItem('token');
  const decoded = jwtDecode(token);
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
    console.log(turfId)
    if (!window.confirm('Do you want to delete this turf?')) return;

    try {
      await authAxios.delete(`/api/user/${userid}/${turfId}`);
      setTurfs(prevTurfs => prevTurfs.filter(turf => turf.id !== turfId));
      window.location.reload();
    } catch (error) {
      console.error('Error deleting turf:', error);
    }
  };

  const openUpdateModal = (turf: Turf) => {
    setSelectedTurf(turf);
    setIsUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedTurf(null);
    getTurfs(); 
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    getTurfs(); 
  };

  return (
    <div>
      <NavBar />
      <Title>My Turfs</Title>
      <button style={{ backgroundColor: 'green', color: 'white' }} onClick={() => setIsCreateModalOpen(true)}>
        Create Turf
      </button>

      <TurfsContainer>
        {turfs.length > 0 ? (
          turfs.map((turf) => (
            <TurfCard key={turf.id}>
              <TurfTitle>{turf.name}</TurfTitle>
              <TurfImage src={`data:image/jpeg;base64,${turf.image_path}`} alt="" />
              <DeleteButton onClick={() => deleteturf(turf.turfId)}>Delete</DeleteButton>
              <DeleteButton onClick={() => openUpdateModal(turf)}>Update</DeleteButton>
            </TurfCard>
          ))
        ) : (
          <NoTurfsMessage>No turfs found.</NoTurfsMessage>
        )}
      </TurfsContainer>

      {isUpdateModalOpen && selectedTurf && <TurfUpdateModal turf={selectedTurf} onClose={closeUpdateModal} />}
      {isCreateModalOpen && <CreateTurfModal onClose={closeCreateModal} />}
    </div>
  );
};

export default Histurf;
