import CustomEditor from "./components/Editor";

function App() {

    

  return (
    <div className="mx-6 mt-12">
      <CustomEditor />
      <div className="text-gray-400">
      <p>Bug: The cursor will jump back to the previous lines end when header one is applied /  developer is working on this issue, thank you for your patience</p>
      <p className="text-xl font-bold">Guide:</p>
        <p>
          <span># and space '# ': </span>
          <span>Heading one</span>
        </p>
        <p>
          <span>* and space '* ': </span>
          <span>Bold Text</span>
        </p>
        <p>
          <span>** and space '** ': </span>
          <span>Red Text</span>
        </p>
        <p>
          <span>*** and space '*** ': </span>
          <span>underline text</span>
        </p>
        <p>
          <span>after applying style, to reset the style: </span>
          <span>press space soon after you apply the style. example: line stated with "# ", then this text "# and space" will be disappeared, to reset the style press a space ' ', this will reset to normal text</span>
        </p>
      </div>
    </div>
  );
}

export default App;
