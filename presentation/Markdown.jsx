import React from 'react';
import marked from 'marked';
import codemirror from 'codemirror';
import trim from 'lodash/trim';

const highlight = containerDomNode => {
  const matchingNodes = containerDomNode.querySelectorAll('pre code');

  for (const domNode of matchingNodes) {
    const code = trim(domNode.textContent);
    const { parentNode } = domNode;
    parentNode.innerHTML = '';
    const divNode = document.createElement('div');
    parentNode.parentNode.insertBefore(divNode, parentNode);

    codemirror(divNode, {
      value: code,
      mode: 'javascript',
      theme: 'dracula',
      lineNumbers: true,
      //readOnly: true,
    });
  }
};

const Markdown = React.createClass({

  getDefaultProps() {
    return {
      value: '',
    };
  },

  componentDidMount() {
    highlight(this.domNode);
  },

  componentDidUpdate() {
    highlight(this.domNode);
  },

  assignNode(node) {
    this.domNode = node;
  },

  renderVideos(html) {
    return html.replace(/\[video (.+)\]/, `
      <div class="video">
        <iframe
          width=\"700\"
          height=\"500\"
          src=\"https://www.youtube.com/embed/$1&rel=0\"
          frameborder=\"0\"
          allowfullscreen>
        </iframe>
      </div>
    `);
  },

  render() {
    const html = this.renderVideos(marked(this.props.value));

    return (
      <div
        ref={this.assignNode}
        className="markdown-body"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  },
});

export default Markdown;
