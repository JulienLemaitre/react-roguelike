import React, { Component } from 'react';

class Background extends Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.grid && nextProps.grid && this.props.grid.length > 0 && nextProps.grid.length > 0)
      return (nextProps.grid.length !== this.props.grid.length &&  nextProps.grid[0].length !== this.props.grid[0].length);
    else
      return true;
  }


  render() {

    const tableWidth = this.props.grid.length > 0 ? this.props.grid[0].length : 0;

    const drawBackground = this.props.grid.map( (row, index) => {
      return (
        <tr key={`row-${index}`} style={{ height: this.props.scale }}>
          {row.map( (cell, index) => {
            return (
              <td key={`cell-${index}`} className={cell}></td>
            );
          })}
        </tr>
      );
    });

    return (
      <table
        className="background"
        style={{ width : tableWidth * this.props.scale}}
      >
        <tbody>
          {drawBackground}
        </tbody>
      </table>
    );
  }
}

export default Background;