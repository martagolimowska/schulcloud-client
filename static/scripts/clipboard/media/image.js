import React from 'react';
import { connect } from 'react-redux';
import {
	DragSource,
} from 'react-dnd';
import mediaTypes from './mediaTypes';

class Image  extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
        const { isDragging, connectDragSource, img } = this.props;
        return connectDragSource(
            <div className="media-container" style={{ opacity: isDragging ? 0.5 : 1 }}>
                <img 
                    src={this.props.url + '/clipboard/uploads/' + img.file} 
                    className="media-picture"
                />
                <div className="media-sender">{img.sender}</div>
            </div>
        );
    }
}

const cardSource = {
    beginDrag(props) {
      return {
        img: props.img
      };
    }
  };

  function collect(connect, monitor) {
    return {
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging()
    };
  }

const DroppableImage = DragSource(mediaTypes.Image, cardSource, collect)(Image);

function mapStateToProps(state) {
  return {
      url: state.socket.url,
  };
}

export default connect(mapStateToProps)(DroppableImage);