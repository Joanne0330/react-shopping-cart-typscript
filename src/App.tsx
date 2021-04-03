import React from 'react';
import { useQuery } from 'react-query';
// Components
import Item from './Item/Item';
import Cart from './Cart/Cart';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import Badge from '@material-ui/core/Badge';
// Styles
import { Wrapper, StyledButton } from './App.styles';
import { LinearProgress } from '@material-ui/core';

//Types
export type CartItemType = {
  id: number;
  category: string;
  description: string;
  image: string;
  price: number;
  title: string;
  amount: number
}

const getProducts = async(): Promise<CartItemType[]> =>
  await(await fetch('https://fakestoreapi.com/products')).json();

const App = () => {
  const [cartOpen, setCartOpen] = React.useState(false);
  const [cartItems, setCartItems] = React.useState([] as CartItemType[]); // empty array which will be filled with CartItemType objs

  const { data, isLoading, error } = useQuery<CartItemType[]>(
    'products',  //what we'll call the data
    getProducts  //the fetching method
  );
  console.log(data)

  const getTotalItems = (items: CartItemType[]) => 
    items.reduce((acc: number, item) => acc + item.amount, 0);

  const handleAddToCart = (clickedItem: CartItemType) => {
    setCartItems((prev: any) => {
      // 1. Is the item already added in the cart?
      const isItemInCart = prev.find((item: any) => item.id === clickedItem.id);

      if(isItemInCart) {
        return prev.map((item: any) => 
          item.id === clickedItem.id
          ? { ...item, amount: item.amount + 1 }
          : item
        );
      }
      // First time the item is added:
      return [...prev, { ...clickedItem, amount: 1 }];
    });
  };

  const handleRemoveFromCart = (id: number) => {
    setCartItems((prev: any) => (
      prev.reduce((acc: any, item: any) => {

        if(item.id === id) { // if we're on the item that we clicked on:
          if(item.amount === 1) return acc; // we remove this item from the array by only returning the accumulator
          return [...acc, { ...item, amount: item.amount -1}]
        } else {
          return [...acc, item] // we don't do anything
        }

      }, [] as CartItemType[]) //the acc starts with empty [] of CartItemType
    ))
  };

  if(isLoading) return <LinearProgress />
  if(error) return <div>Something went wrong...</div>

  return (
    <Wrapper>
      <Drawer anchor='right' open={cartOpen} onClose={() => setCartOpen(false)}>
        <Cart 
          cartItems={cartItems} 
          addToCart={handleAddToCart} 
          removeFromCart={handleRemoveFromCart}
        />
      </Drawer>
      <StyledButton onClick={() => setCartOpen(true)}>
        <Badge badgeContent={getTotalItems(cartItems)} color='error'>
          <AddShoppingCartIcon />
        </Badge>
      </StyledButton>
      <Grid container spacing={3}>
        {data?.map(item => (
          <Grid item key={item.id} xs={12} sm={4}>
            <Item item={item} handleAddToCart={handleAddToCart} />
          </Grid>
        ))}
      </Grid>
    </Wrapper>
  );
}

export default App;
