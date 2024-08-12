import React from "react";

const TalkingAnimation = () => {
  return (
    <div class="animation-bars">
      <div class="animation-bar"></div>
      <div class="animation-bar"></div>
      <div class="animation-bar"></div>
      <div class="animation-bar"></div>
      <div class="animation-bar"></div>
      <div class="animation-bar"></div>
      <div class="animation-bar"></div>
      <div class="animation-bar"></div>
      <div class="animation-bar"></div>
      <div class="animation-bar"></div>
    </div>
  );
};

export default TalkingAnimation;

const ListeningAnimation = () => {
  return (
    <div class="listening-animation-container">
      <div class="container">
        <button id="speech" class="btn">
          <i class="fa fa-microphone" aria-hidden="true"></i>{" "}
        </button>
        <div class="pulse-ring"></div>
      </div>
    </div>
  );
};

export { ListeningAnimation };
