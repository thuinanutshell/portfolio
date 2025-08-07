const texts = ["vietnam", "san francisco", "seoul", "berlin", "buenos aires"];
let wordIndex = 0;
let charIndex = 0;

export function typeLetter(textSpan) {
  const currentWord = texts[wordIndex];

  if (charIndex < currentWord.length) {
    textSpan.textContent += currentWord.charAt(charIndex);
    charIndex++;
    setTimeout(() => typeLetter(textSpan), 150);
  } else {
    setTimeout(() => eraseLetter(textSpan), 1000);
  }
}

function eraseLetter(textSpan) {
  if (charIndex > 0) {
    textSpan.textContent = textSpan.textContent.slice(0, -1);
    charIndex--;
    setTimeout(() => eraseLetter(textSpan), 100);
  } else {
    wordIndex = (wordIndex + 1) % texts.length;
    setTimeout(() => typeLetter(textSpan), 300);
  }
}
