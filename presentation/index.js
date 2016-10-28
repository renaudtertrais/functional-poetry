import '../node_modules/codemirror/mode/javascript/javascript';
import '../node_modules/codemirror/lib/codemirror.css';
import '../node_modules/codemirror/theme/dracula.css';
import './style.css';

// Import React
import React from "react";
import marked from 'marked';

import content from '../SLIDES.md';

// Import Spectacle Core tags
import {
  Deck,
  Slide,
  Spectacle,
} from "spectacle";

import Markdown from './Markdown.jsx';

// Import image preloader util
import preloader from "spectacle/lib/utils/preloader";

// Import theme
import createTheme from "spectacle/lib/themes/default";

// Import custom component
import Interactive from "../assets/interactive";

// Require CSS
require("normalize.css");
require("spectacle/lib/themes/default/index.css");

const colors = {
  red: '#BF263C',
  orange: '#E9573F',
  //yellow: '#F6BB42',
  lightGreen: '#8CC152',
  green: '#2ABA66',
  turquoise: '#37BC9B',
  blueGrey: '#7DB1B1',
  blue: '#3BAFDA',
  blueJean: '#4A89DC',
  purple: '#6A50A7',
  pink: '#D770AD',
  beige: '#AA8E69',
  brown: '#7B7163',
  grey: '##AAB2BD',
};

const theme = createTheme(colors);

const colorsNames = Object.keys(colors);

const slides = content.split('---').map((md, i) => ({
  md: md,
  i,
  color: colorsNames[Math.round(Math.random() * (colorsNames.length - 1))]
}));

export default class Presentation extends React.Component {
  render() {
    return (
      <Spectacle theme={theme}>
        <Deck>
          {slides.map(({ md, i, color }) => (
            <Slide key={i} transition={["slide"]} bgColor={color}>
              <Markdown value={md} />
            </Slide>
          ))}
        </Deck>
      </Spectacle>
    );
  }
}
