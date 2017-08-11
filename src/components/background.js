import React, { Component } from 'react';

class Background extends Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.grid && nextProps.grid && this.props.grid.length > 0 && nextProps.grid.length > 0) {
      // return (nextProps.grid.length !== this.props.grid.length &&  nextProps.grid[0].length !== this.props.grid[0].length);
      // console.log("une grille, comparons!");
      let update = false;
      for (let i = 0 ; i < nextProps.grid[0].length ; i++) {
        // console.log("nextProps.grid[0][i]",nextProps.grid[0][i],"this.props.grid[0][i]",this.props.grid[0][i],nextProps.grid[0][i] === this.props.grid[0][i]);
        if (nextProps.grid[1][i] !== this.props.grid[1][i])
          update = true
      }
      // console.log("update ?", update);
      return update;
    }
    else {
      // console.log("pas de grille, update!");
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