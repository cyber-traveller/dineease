import React, { useState, useEffect } from 'react';
import { Box, Button, Container, Grid, Typography, Paper } from '@mui/material';
import RestaurantForm from './RestaurantForm';
import RestaurantList from './RestaurantList';

const Dashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await fetch('/api/restaurants/owner');
      const data = await response.json();
      setRestaurants(data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  };

  const handleCreateRestaurant = () => {
    setSelectedRestaurant(null);
    setShowForm(true);
  };

  const handleEditRestaurant = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedRestaurant(null);
    fetchRestaurants();
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Restaurant Dashboard
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateRestaurant}
        >
          Add New Restaurant
        </Button>
      </Box>

      {showForm ? (
        <RestaurantForm
          restaurant={selectedRestaurant}
          onClose={handleFormClose}
        />
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <RestaurantList
                restaurants={restaurants}
                onEdit={handleEditRestaurant}
                onRefresh={fetchRestaurants}
              />
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default Dashboard;