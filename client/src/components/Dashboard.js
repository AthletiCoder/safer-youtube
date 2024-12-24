// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from '../api';

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Tabs = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
`;

const Tab = styled.div`
  padding: 10px 20px;
  cursor: pointer;
  border-bottom: ${(props) => (props.active ? '2px solid #007bff' : 'none')};
  font-weight: ${(props) => (props.active ? 'bold' : 'normal')};
`;

const SearchBar = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const List = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const ChannelCard = styled.div`
  width: 200px;
  margin: 10px;
  text-align: center;
  cursor: pointer;
`;

const RequestCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const Button = styled.button`
  padding: 8px 15px;
  margin-left: 10px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('whitelisted');
  const [channels, setChannels] = useState([]);
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState('');
  const [exploreResults, setExploreResults] = useState([]);

  useEffect(() => {
    fetchChannels();
    fetchRequests();
  }, []);

  const fetchChannels = async () => {
    try {
      const res = await axios.get('/youtube/channels');
      setChannels(res.data);
    } catch (error) {
      console.error('Error fetching channels:', error);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get('/requests');
      setRequests(res.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const handleRequest = async (id) => {
    try {
      await axios.post('/requests/re-notify', { id });
      alert('Request re-notified to admins.');
    } catch (error) {
      console.error('Error notifying request:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/requests/${id}`);
      setRequests(requests.filter((req) => req._id !== id));
    } catch (error) {
      console.error('Error deleting request:', error);
    }
  };

  const handleExploreSearch = async (e) => {
    const query = e.target.value;
    setSearch(query);
  
    if (query.length > 2) {
      try {
        const res = await axios.get(`/youtube/explore?search=${query}`);
        setExploreResults(res.data);
      } catch (error) {
        console.error('Error searching explore:', error);
      }
    } else {
      setExploreResults([]);
    }
  };

  const handleWhitelistRequest = async (item) => {
    try {
      await axios.post('/requests', { name: item.name, type: item.type, id: item.id });
      alert(`${item.name} requested for whitelisting.`);
    } catch (error) {
      console.error('Error requesting whitelist:', error);
    }
  };

  const filteredChannels = channels.filter((channel) =>
    channel.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container>
      <h1>Dashboard</h1>
      <Tabs>
        <Tab active={activeTab === 'whitelisted'} onClick={() => setActiveTab('whitelisted')}>
          Whitelisted Channels
        </Tab>
        <Tab active={activeTab === 'explore'} onClick={() => setActiveTab('explore')}>
          Explore
        </Tab>
        <Tab active={activeTab === 'requests'} onClick={() => setActiveTab('requests')}>
          Pending Requests
        </Tab>
      </Tabs>

      {activeTab === 'whitelisted' && (
        <>
          <SearchBar
            placeholder="Search Channels..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <List>
            {filteredChannels.map((channel) => (
              <ChannelCard key={channel._id} onClick={() => window.open(`https://www.youtube.com/channel/${channel.channelId}`)}>
                <img src={channel.iconUrl} alt={channel.name} width="100" height="100" />
                <p>{channel.name}</p>
              </ChannelCard>
            ))}
          </List>
        </>
      )}

      {activeTab === 'explore' && (
        <>
          <SearchBar
            placeholder="Search Channels or Videos..."
            value={search}
            onChange={handleExploreSearch}
          />
          <List>
            {exploreResults.map((item) => (
              <RequestCard key={item.id}>
                <span>{item.name}</span>
                <img src={item.iconUrl} alt={item.name} width="100" height="100" />
                <Button onClick={() => handleWhitelistRequest(item)}>Request Whitelist</Button>
              </RequestCard>
            ))}
          </List>
        </>
      )}

      {activeTab === 'requests' && (
        requests.map((req) => (
          <RequestCard key={req._id}>
            <span>{req.name}</span>
            <div>
              <Button onClick={() => handleRequest(req._id)}>Re-Notify</Button>
              <Button onClick={() => handleDelete(req._id)}>Delete</Button>
            </div>
          </RequestCard>
        ))
      )}
    </Container>
  );
};

export default Dashboard;
