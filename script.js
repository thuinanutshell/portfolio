const texts = ["vietnam", "san francisco", "seoul", "berlin", "buenos aires"];
const textSpan = document.getElementById("text");
let wordIndex = 0;
let charIndex = 0;

function typeLetter() {
  const currentWord = texts[wordIndex];
  
  if (charIndex < currentWord.length) {
    textSpan.textContent += currentWord.charAt(charIndex);
    charIndex++;
    setTimeout(typeLetter, 150);
  } else {
    setTimeout(() => {
      eraseLetter();
    }, 1000); // Wait before erasing
  }
}

function eraseLetter() {
  if (charIndex > 0) {
    textSpan.textContent = textSpan.textContent.slice(0, -1);
    charIndex--;
    setTimeout(eraseLetter, 100);
  } else {
    wordIndex = (wordIndex + 1) % texts.length;
    setTimeout(typeLetter, 300);
  }
}

window.onload = typeLetter;