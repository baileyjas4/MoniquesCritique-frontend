import { 
  MdRestaurant, 
  MdLocalCafe, 
  MdLocalBar, 
  MdFastfood,
  MdPlace,
  MdLocalPizza,
  MdBakeryDining,
  MdIcecream,
  MdLunchDining,
  MdDinnerDining,
  MdBreakfastDining,
  MdLocalDining
} from 'react-icons/md';

const CategoryIcon = ({ category, size = 24, className = '' }) => {
  const iconProps = {
    size,
    className
  };

  const iconMap = {
    restaurant: <MdRestaurant {...iconProps} />,
    cafe: <MdLocalCafe {...iconProps} />,
    coffee_shop: <MdLocalCafe {...iconProps} />,
    bar: <MdLocalBar {...iconProps} />,
    pizza: <MdLocalPizza {...iconProps} />,
    bakery: <MdBakeryDining {...iconProps} />,
    dessert: <MdIcecream {...iconProps} />,
    lunch: <MdLunchDining {...iconProps} />,
    dinner: <MdDinnerDining {...iconProps} />,
    breakfast: <MdBreakfastDining {...iconProps} />,
    dining: <MdLocalDining {...iconProps} />,
    fast_food: <MdFastfood {...iconProps} />,
    other: <MdFastfood {...iconProps} />
  };

  return iconMap[category?.toLowerCase()] || <MdPlace {...iconProps} />;
};

export default CategoryIcon;
