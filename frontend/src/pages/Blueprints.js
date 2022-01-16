import { useEffect, useState } from "react";
import BlueprintForm from "../components/blueprints/BlueprintForm";
import BlueprintsArea from "../components/blueprints/BlueprintsArea";

export default function Blueprints(props) {
  const [userBlueprints, setUserblueprints] = useState([]);

  const getBlueprints = () => {
    fetch("/api/get_user_blueprints/", {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log([data]);
        setUserblueprints(data);
      })
      .catch((err) => {
        console.log("could not get data. err: " + err);
      });
    console.log('called get blueprints')
  };

  useEffect(() => {
     getBlueprints();
     console.log(userBlueprints)
  }, []);

  return (
    <>
      <BlueprintForm getBlueprints={getBlueprints}/>
      <BlueprintsArea getBlueprints={getBlueprints} blueprints={userBlueprints}/>
    </>
  );
}
