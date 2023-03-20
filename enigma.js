const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const rotors = [
  "EKMFLGDQVZNTOWYHXUSPAIBRCJ",
  "AJDKSIRUXBLHWTMCQGZNPYFVOE",
  "BDFHJLCPRTXVZNYEIWGAKMUSQO",
];
const reflector = "YRUHQSLDPXNGOKMIEBFZCWVJAT";
let rotorPositions = [0, 0, 0];
let plugboard = {};

function rotateRotor(position) {
  return (position + 1) % alphabet.length;
}

function substituteLetter(letter) {
  letter = plugboard[letter] || letter;
  let result = letter;
  for (let i = rotors.length - 1; i >= 0; i--) {
    const rotor = rotors[i];
    const rotorPosition = (rotorPositions[i] + i) % alphabet.length;
    const letterIndex = alphabet.indexOf(result);
    const substitutedLetter = rotor.charAt(
      (letterIndex + rotorPosition) % alphabet.length
    );
    const reverseSubstitutedLetter = alphabet.charAt(
      (alphabet.indexOf(substitutedLetter) - rotorPosition + alphabet.length) %
        alphabet.length
    );
    result = reverseSubstitutedLetter;
  }
  const reflectorIndex = alphabet.indexOf(result);
  const reflectedLetter = reflector.charAt(reflectorIndex);
  result = reflectedLetter;

  for (let i = 0; i < rotors.length; i++) {
    const rotor = rotors[i];
    const rotorPosition = (rotorPositions[i] + i) % alphabet.length;
    const letterIndex = alphabet.indexOf(result);
    const substitutedLetter = alphabet.charAt(
      (rotor.indexOf(
        alphabet.charAt((letterIndex + rotorPosition) % alphabet.length)
      ) -
        rotorPosition +
        alphabet.length) %
        alphabet.length
    );
    result = substitutedLetter;
  }
  result = plugboard[result] || result;
  return result;
}

function encryptMessage(message) {
  let encryptedMessage = "";
  for (let i = 0; i < message.length; i++) {
    const letter = message.charAt(i).toUpperCase();
    if (alphabet.indexOf(letter) === -1) {
      continue;
    }
    rotorPositions[0] = rotateRotor(rotorPositions[0]);
    if (rotorPositions[0] === 0) {
      rotorPositions[1] = rotateRotor(rotorPositions[1]);
      if (rotorPositions[1] === 0) {
        rotorPositions[2] = rotateRotor(rotorPositions[2]);
      }
    }
    const encryptedLetter = substituteLetter(letter);
    encryptedMessage += encryptedLetter;
  }
  return encryptedMessage;
}

rl.question("Ingresa el mensaje que quieres cifrar: ", (message) => {
  console.log(`El mensaje cifrado es: ${encryptMessage(message)}`);
  rl.close();
});
