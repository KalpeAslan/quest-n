import { Component, createRef, ReactNode, RefObject } from "react";
import styled from "@emotion/styled";

interface IProps {
  freq?: number;
  offset?: number;
  children: ReactNode;
}

interface IState {
  left?: number;
  isDraging: boolean;
}

export class CustomMarquee extends Component<IProps, IState> {
  private readonly dragSpan: RefObject<HTMLDivElement>;
  private scrollTimer: any;
  private spanWidth: number;
  private prePageX: number;
  private currentPageX: number;

  constructor(props) {
    super(props);
    this.dragSpan = createRef();
    this.scrollTimer = null;
    this.state = {
      isDraging: false,
      left: 0,
    };
  }

  componentDidMount() {
    this.initMarquee();
  }

  componentWillUnmount() {
    clearInterval(this.scrollTimer);
  }

  initMarquee() {
    const { freq = 15 } = this.props;
    let spanWidth = this.dragSpan.current.getBoundingClientRect().width;
    const windowWidth = window.innerWidth;
    this.spanWidth = Math.max(spanWidth, windowWidth);
    this.scrollTimer = setInterval(this.move, freq);
  }

  move = () => {
    const { offset = 1 } = this.props;
    let left = this.state.left - offset;
    if (left < -this.spanWidth) {
      left = window.innerWidth;
    }
    this.setState({ left });
  };

  handleMouseEnter = () => {
    clearInterval(this.scrollTimer);
  };

  handMouseLeave = () => {
    const { freq = 15 } = this.props;
    this.scrollTimer = setInterval(this.move, freq);
    this.setState({ isDraging: false });
  };

  handleDrag = e => {
    this.prePageX = this.currentPageX;
    this.currentPageX = e.pageX;
    const left = this.state.left + (this.currentPageX - this.prePageX);
    this.setState({ left });
  };

  handleMouseDown = e => {
    this.setState({ isDraging: true });
    this.prePageX = e.pageX;
    this.currentPageX = this.prePageX;
  };

  handleMouseUp = () => {
    this.setState({ isDraging: false });
  };

  render() {
    const handleDrag = this.state.isDraging ? this.handleDrag : null;
    return (
      <PartnersMarqueeStyled
        className={"marquee"}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handMouseLeave}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        onMouseMove={handleDrag}
      >
        <div className="drag-span" style={{ left: this.state.left }}>
          <div draggable={false} className={"c-flex"} ref={this.dragSpan}>
            {this.props.children}
            {this.props.children}
          </div>
        </div>
      </PartnersMarqueeStyled>
    );
  }
}

export const PartnersMarqueeStyled = styled.div`
  cursor: all-scroll;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;

  .drag-span {
    line-height: 50px;
    height: 50px;
    position: relative;
    user-select: none;
  }
`;
