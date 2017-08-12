import React, { Component } from 'react';

class Background extends Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  shouldComponentUpdate(nextProps) {
    // We make sure we don't update the board background
    // until there is a new game to draw or a change of stage,
    // i.e. the grid provided is not the same than the one at the previous one.
    if (this.props.grid && nextProps.grid && this.props.grid.length > 0 && nextProps.grid.length > 0) {
      let update = false;
      for (let i = 0 ; i < nextProps.grid[0].length ; i++) {
        // Compraing the second line is sufficient to differenciate the stages.
        if (nextProps.grid[1][i] !== this.props.grid[1][i])
          update = true
      }
      return update;
    }
    else {
      return true;
    }
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