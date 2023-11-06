import fullCourse from "../../images/full-course.png";
import mainDish from "../../images/main-dish.png";
import riceBowls from "../../images/rice-bowls.png";
import snacks from "../../images/snacks.png";
import drinks from "../../images/drinks.png";
import "./FoodNav.css";

export const FoodNav = ({ setSelectedFoodType }) => {
  return (
    <div className="food-nav">
      <img
        src={fullCourse}
        onClick={() => setSelectedFoodType("")}
        alt="fullCourse"
      />
      <img
        src={mainDish}
        onClick={() => {
          setSelectedFoodType("Main Dish");
        }}
        alt="mainDish"
      />
      <img
        src={riceBowls}
        onClick={() => setSelectedFoodType("Kakanin")}
        alt="riceBowls"
      />
      <img
        src={snacks}
        onClick={() => setSelectedFoodType("Snacks")}
        alt="snacks"
      />
      <img
        src={drinks}
        onClick={() => setSelectedFoodType("Drinks")}
        alt="drinks"
      />
    </div>
  );
};
