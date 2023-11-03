import Flow from "./Flow";
import Editor from "./Editor";
import "./styles.css";

// Hooks
import { useGetPokemonByNameQuery } from "./services/pokemon";
import { Counter } from "./features/counter/Counter";
import PostsManager from "./features/posts/Posts";
import { WebSocketDemo } from "./features/socket/Socket";

export default function App() {
  
  const { data, error, isLoading } = useGetPokemonByNameQuery('bulbasaur')
  
  return (
    <div className="h-screen w-screen">
      <WebSocketDemo />
      {/* 
      <PostsManager />
      <Counter />
      <div>
          {error ? (
            <>Oh no, there was an error</>
          ) : isLoading ? (
            <>Loading...</>
          ) : data ? (
            <>
              <h3>{data.species.name}</h3>
              <img src={data.sprites.front_shiny} alt={data.species.name} />
            </>
          ) : null}
        </div> 
        <Flow />      
      <Editor /> 
      */}
    </div>
  );
}
