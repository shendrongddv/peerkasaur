"use client";

import { useState } from "react";
import { faker } from "@faker-js/faker";

const RandomGenerator = () => {
  const [name, setName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [babyName, setBabyName] = useState<string>("");

  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [sex, setSex] = useState("");
  const [sexType, setSexType] = useState("");
  const [prefix, setPrefix] = useState("");
  const [suffix, setSuffix] = useState("");
  const [zodiacSign, setZodiacSign] = useState("");
  const [bio, setBio] = useState("");

  const generateRandomValues = () => {
    setName(faker.name.fullName());
    setUsername(faker.internet.userName());
    setBabyName(faker.name.firstName());

    setFirstName(faker.person.firstName());
    setMiddleName(faker.person.middleName());
    setLastName(faker.person.lastName());
    setFullName(faker.person.fullName());
    setGender(faker.person.gender());
    setSex(faker.person.sex());
    setSexType(faker.person.sexType());
    setPrefix(faker.person.prefix());
    setSuffix(faker.person.suffix());
    setZodiacSign(faker.person.zodiacSign());
    setBio(faker.person.bio());
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Random Generator</h1>
      <button onClick={generateRandomValues} style={{ padding: "10px 20px" }}>
        Generate Random Values
      </button>
      <div style={{ marginTop: "20px" }}>
        <p>
          <strong>First Name:</strong> {firstName}
        </p>
        <p>
          <strong>Middle Name:</strong> {middleName}
        </p>
        <p>
          <strong>Last Name:</strong> {lastName}
        </p>
        <p>
          <strong>Full Name:</strong> {`${firstName} ${middleName} ${lastName}`}
        </p>
        <p>
          <strong>Full Name (fake):</strong> {fullName}
        </p>
        <p>
          <strong>Gender:</strong> {gender}
        </p>
        <p>
          <strong>Sex:</strong> {sex}
        </p>
        <p>
          <strong>Sex Type:</strong> {sexType}
        </p>
        <p>
          <strong>Prefix:</strong> {prefix}
        </p>
        <p>
          <strong>Suffix:</strong> {suffix}
        </p>
        <p>
          <strong>Zodiac Sign:</strong> {zodiacSign}
        </p>
        <p>
          <strong>Bio:</strong> {bio}
        </p>
        <hr />
        <p>
          <strong>Random Name:</strong> {name}
        </p>
        <p>
          <strong>Random Username:</strong> {username}
        </p>
        <p>
          <strong>Random Baby Name:</strong> {babyName}
        </p>
      </div>
    </div>
  );
};

export default RandomGenerator;
