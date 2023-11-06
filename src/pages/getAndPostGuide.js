import React, { useEffect, useState } from 'react';
import { createFood, getAllFoods } from '../service/FoodService';

const App = () => {
  const [foods, setFoods] = useState([]);
  const [newFood, setNewFood] = useState({
    foodType: '',
    name: '',
    isAvailable: false,
    price: 0,
    file: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllFoods();
      setFoods(data);
    };

    fetchData();
  }, []);

  const handleInputChange = (event) => {
    setNewFood({
      ...newFood,
      [event.target.name]: event.target.value,
    });
  };

  const handleCheckboxChange = (event) => {
    setNewFood({
      ...newFood,
      isAvailable: event.target.checked,
    });
  };

  const handleFileChange = (event) => {
    setNewFood({
      ...newFood,
      file: event.target.files[0],
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await createFood(newFood);
    setNewFood({ foodType: '', name: '', isAvailable: false, price: 0, file: null });
    const data = await getAllFoods();
    setFoods(data);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" name="foodType" onChange={handleInputChange} />
        <input type="text" name="name" onChange={handleInputChange} />
        <input type="checkbox" name="isAvailable" onChange={handleCheckboxChange} />
        <input type="number" name="price" onChange={handleInputChange} />
        <input type="file" name="file" onChange={handleFileChange} />
        <button type="submit">Add food</button>
      </form>
      <ul>
        {foods.map((food) => (
          <li key={food.id}>
            <h2>{food.name}</h2>
            <p>{food.foodType}</p>
            <p>{food.price}</p>
            <img src={food.imageUrl} alt={food.name} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
