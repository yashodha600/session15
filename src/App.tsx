import  "./App.css";
import List from "./components/List";
import InputWithLabel from "./components/InputWithLabel";
import useSemiPersistantState from "./hooks/useSemiPersistentState";
import { useEffect, useReducer } from "react";
import { type } from "os";


const storiesReducer = (state: any, action: any) => {
switch(action.type) {
case "FETCH_INIT": 
return { ...state, isLoading: true, isError: false };
case "SET_STORIES": 
  return { data: action.payload, isLoading: false, isError: false };

  case "REMOVE_STORY": {
    const showStories = state.data.filter(
      (item: any) => item.objectID !== action.payload);
      return { data: showStories, isLoading: false, isError: false };
  }
  case "FETCH_STORIES_FAILED": 
  return { ...state, isError: true, isLoading: false };
    default:
      return state; 
}
};
const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query=";

function App() {

const [searchTerm, setSearchTerm] = useSemiPersistantState("","searchTerm");
const [stories, dispatchStories] = useReducer(storiesReducer, {
  data: [],
   isLoading: false,
  isError: false,
});

  const handleSearchChange = (e: any) => {
    setSearchTerm(e.target.value); 
  };

useEffect(() => {
  dispatchStories({ type: "FETCH_INIT" });
 fetch(API_ENDPOINT + searchTerm)
 .then((res) => res.json())
  .then((result: any) => {
    dispatchStories({ type: "SET_STORIES", payload: result.hits });
  })
  .catch((e) => {
    console.log("Error is", e);
  dispatchStories({ type: "FETCH_STORIES_FAILED" });
 });
}, [searchTerm]);

  const filteredList: any = stories.data.filter((item: any ) => {
      return item.title?.toLowerCase()?.includes(searchTerm.toLowerCase());
  } );

  const handleRemoveStory = (id: any) => {
   dispatchStories({ type: "REMOVE_STORY", payload: id });
  };

  return (
    <div className="container">
      <h1>Hacker Stories</h1>

      <InputWithLabel 
      id="search"
       value={searchTerm} 
       onChange={handleSearchChange}
       autoFocus={true}
       >
         search
         </InputWithLabel>
      {stories.isLoading ? (
      <p>Loading...</p>
      ) : (
      <List stories={stories.data} onDelete={handleRemoveStory} />
       )}
       {stories.isError && <p>something went wrong!</p>}
      </div>
  );
}
export default App;
