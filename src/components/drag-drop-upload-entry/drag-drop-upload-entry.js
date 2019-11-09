import React from 'react';
import {bytesToSize} from '../../utils/math';
import {animate} from '../../utils/animate';
import {readFile} from '../../utils/read-file';
import {classList} from '../../utils/elements';

export default class DragDropUploadEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loadedPercent: 0,
      fileContents: null,
      fileName: props.file.name,
      fileSize: bytesToSize(props.file.size),
    }
  }

  async componentDidMount() {
    const fileContents = await readFile(this.props.file);
    this.setState({ fileContents });
    await animate(0, 100, 1200, (currentValue) => {
      this.setState({ loadedPercent: currentValue })
    });
  }

  getPieStyle() {
    return {
      strokeDasharray: (this.state.loadedPercent * 2 * Math.PI * 8 / 100) + ' ' + 2 * Math.PI * 8,
    };
  }

  render() {
    return <li className="drag-drop-upload-entry">
      <img
        src={this.state.fileContents}
        alt={this.state.fileName}
      />
      <div className="text">
        <strong>{this.state.fileName}</strong>
        <small>{this.state.fileSize}</small>
      </div>
      <div
        className={classList({ progress: true, complete: this.state.loadedPercent >= 100 })}
      >
        <svg
          className="pie"
          width="32"
          height="32"
          style={this.getPieStyle()}
        >
          <circle
            r="8"
            cx="16"
            cy="16"
          />
        </svg>
        <svg
          className="tick"
          viewBox="0 0 24 24"
        >
          <polyline points="18,7 11,16 6,12"/>
        </svg>
      </div>
    </li>
  }
}
