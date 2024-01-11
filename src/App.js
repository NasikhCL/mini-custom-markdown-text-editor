import CustomEditor from "./components/Editor";
import SaveButton from "./components/SaveButton";
import Title from "./components/Title";

function App() {
  return (
    <div className="mt-12 mx-10">
      <div className="flex justify-between mb-3">
        <h2 className="text-blue-400">portle logo</h2>
        <Title className="" />
        <SaveButton />
      </div>
      <CustomEditor />
    </div>
  );
}

export default App;
