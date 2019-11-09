import React from 'react';
import {getRotationToPoint, distanceToPoint, classList} from '../../utils/elements';
import {waitFor} from '../../utils/wait-for';
import DragDropUploadEntry from '../drag-drop-upload-entry/drag-drop-upload-entry'

export default class DragDropUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hovering: false,
      mouse: { x: 0, y: 0 },
      files: [],
      show: false,
      dragged: false,
      dropped: false,
      showDrops: false,
      currentDistance: 0,
      placeholderElement: document.createElement('span'),

      cssRotation: null,
      dropContainer: null,
    };

    this.drop = this.drop.bind(this);
    this.dragLeave = this.dragLeave.bind(this);
    this.dragOver = this.dragOver.bind(this);
    this.getRotationCSS = this.getRotationCSS.bind(this);
    this.getClasses = this.getClasses.bind(this);
  }

  componentDidMount() {
    const dropContainer = document.querySelector('.drop');
    this.setState({
      dropContainer,
      circle: dropContainer.querySelector('.circle'),
      list: document.querySelector('.list'),
    })
  }

  getRotationCSS() {
    const el = this.state.dropContainer || this.state.placeholderElement;
    return {
      '--r': getRotationToPoint(el, this.state.mouse.x, this.state.mouse.y) + 'deg'
    };
  }

  getClasses() {
    return classList({
      drop: true,
      dropped: this.state.dropped,
      showDrops: this.state.showDrops,
      dragged: this.state.dragged,
      show: this.state.show,
    });
  }

  dragOver(e) {
    e.preventDefault();

    this.setState({
      dragged: true,
      showDrops: true,
      mouse: {
        x: e.pageX,
        y: e.pageY,
      }
    });

    // 144 is the offset between circle and its container
    let distance = distanceToPoint(this.state.circle, this.state.mouse.x, this.state.mouse.y) / 144;

    this.setState({ hovering: distance < .3 });

    if (this.state.hovering) {
      distance = 1;
    }

    this.setState({
      currentDistance: distance * 12,
    });

    this.setPathData(this.state.currentDistance);
  }

  dragLeave(e) {
    e.preventDefault();
    this.setState({ dragged: false, showDrops: false });
  }

  async drop(e) {
    e.preventDefault();

    this.setState({
      files: Array.from(e.dataTransfer.files),
    });

    if (!this.state.dropped) {
      this.setState({ dropped: true });
      await waitFor(400);

      // go from the current distance to 18 in 100 milliseconds
      this.showDrops = false;

      await waitFor(300);

      this.setState({ show: true });
    }
  }

  setPathData(value) {
    const svgPath = this.state.circle.querySelector('svg path');
    if (svgPath) {
      svgPath.setAttribute('d', 'M46,80 C55.3966448,80 63.9029705,76.1880913 70.0569683,70.0262831 C76.2007441,63.8747097 80,55.3810367 80,46 C80,36.6003571 76.1856584,28.0916013 70.0203842,21.9371418 C63.8692805,15.7968278 55.3780386, ' + value + ' 46, ' + value + ' C36.596754, ' + value + ' 28.0850784,15.8172663 21.9300655,21.9867066 C15.7939108,28.1372443 12,36.6255645 12,46 C12,55.4035343 15.8175004,63.9154436 21.9872741,70.0705007 C28.1377665,76.2063225 36.6258528,80 46,80 Z');
    }
  }

  render() {
    return <div
      className={this.getClasses()}
      style={this.getRotationCSS()}
      onDragLeave={this.dragLeave}
      onDragOver={this.dragOver}
      onDrop={this.drop}
    >
      <nav>
        <ul>
          <li>
            <a>Recent uploads</a>
          </li>
        </ul>
      </nav>
      <div className="intro">
        <h4>No recent files</h4>
        <p>Drag &amp; Drop to upload or create a new watch folder for Auto-upload</p>
      </div>
      <div className="center">
        <div>
          <span>Upload</span>
          <div className="circle">
            <svg
              className={classList({ hovering: this.state.hovering })}
              viewBox="0 0 92 92"
              fill="currentColor"
            >
              <path
                d="M46,80 C55.3966448,80 63.9029705,76.1880913 70.0569683,70.0262831 C76.2007441,63.8747097 80,55.3810367 80,46 C80,36.6003571 76.1856584,28.0916013 70.0203842,21.9371418 C63.8692805,15.7968278 55.3780386, 12 46, 12 C36.596754, 12 28.0850784,15.8172663 21.9300655,21.9867066 C15.7939108,28.1372443 12,36.6255645 12,46 C12,55.4035343 15.8175004,63.9154436 21.9872741,70.0705007 C28.1377665,76.2063225 36.6258528,80 46,80 Z"
              />
            </svg>
          </div>
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              d="M5.2319,10.6401 C5.5859,11.0641 6.2159,11.1221 6.6399,10.7681 L10.9999,7.1351 L10.9999,19.0001 C10.9999,19.5521 11.4479,20.0001 11.9999,20.0001 C12.5519,20.0001 12.9999,19.5521 12.9999,19.0001 L12.9999,7.1351 L17.3599,10.7681 C17.7849,11.1221 18.4149,11.0641 18.7679,10.6401 C19.1219,10.2161 19.0649,9.5851 18.6399,9.2321 L12.6399,4.2321 C12.5929,4.1921 12.5369,4.1731 12.4849,4.1431 C12.4439,4.1191 12.4079,4.0911 12.3629,4.0731 C12.2459,4.0271 12.1239,4.0001 11.9999,4.0001 C11.8759,4.0001 11.7539,4.0271 11.6369,4.0731 C11.5919,4.0911 11.5559,4.1191 11.5149,4.1431 C11.4629,4.1731 11.4069,4.1921 11.3599,4.2321 L5.3599,9.2321 C4.9359,9.5851 4.8779,10.2161 5.2319,10.6401"
            />
          </svg>
        </div>
      </div>
      <div className="hint">Drop your files to upload</div>
      <ul className="list">
        {
          this.state.files.map((file, key) => (
            <DragDropUploadEntry
              file={file}
              key={key}
            />)
          )
        }
      </ul>

    </div>
  }
}
