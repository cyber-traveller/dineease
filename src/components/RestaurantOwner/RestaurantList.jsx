import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Box
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const RestaurantList = ({ restaurants, onEdit, onRefresh }) => {
  const handleDelete = async (restaurantId) => {
    if (!window.confirm('Are you sure you want to delete this restaurant?')) {
      return;
    }

    try {
      const response = await fetch(`/api/restaurants/${restaurantId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete restaurant');
      }

      onRefresh();
    } catch (error) {
      console.error('Error deleting restaurant:', error);
    }
  };

  if (restaurants.length === 0) {
    return (
      <Box textAlign="center" py={3}>
        <Typography variant="body1" color="text.secondary">
          No restaurants found. Click "Add New Restaurant" to create one.
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Cuisine</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Opening Hours</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {restaurants.map((restaurant) => (
            <TableRow key={restaurant._id}>
              <TableCell>{restaurant.name}</TableCell>
              <TableCell>{restaurant.cuisine}</TableCell>
              <TableCell>{restaurant.address}</TableCell>
              <TableCell>{restaurant.phone}</TableCell>
              <TableCell>{restaurant.openingHours}</TableCell>
              <TableCell align="right">
                <IconButton
                  color="primary"
                  onClick={() => onEdit(restaurant)}
                  size="small"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => handleDelete(restaurant._id)}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RestaurantList;