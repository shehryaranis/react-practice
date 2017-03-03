import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';


     var Excel = React.createClass({
        displayName: 'Excel',
        //for body display
        propTypes: {
          headers: React.PropTypes.arrayOf(
            React.PropTypes.string
          ),
          initialData: React.PropTypes.arrayOf(
            React.PropTypes.arrayOf(
              React.PropTypes.string
            )
          ),
        },
//for initial data
        getInitialState: function() {
          return {
            data: this.props.initialData,
            sortby: null,
            descending: false,
            edit: null,
            search: false,
          };
        },
        //sorting
        _sort: function(e) {
          var column = e.target.cellIndex;
          var data = this.state.data.slice();
          //acending and decending
          var descending = this.state.sortby === column && !this.state.descending;
          data.sort(function(a, b) {
            return descending 
              ? (a[column] < b[column] ? 1 : -1)
              : (a[column] > b[column] ? 1 : -1);
          });
          //update state
          this.setState({
            data: data,
            sortby: column,
            descending: descending,
          });
        },

        
        _showEditor: function(e) {
          this.setState({edit: {
            row: parseInt(e.target.dataset.row, 10),
            cell: e.target.cellIndex,
          }});
        },
        
        _save: function(e) {
          e.preventDefault();
          var input = e.target.firstChild;
          var data = this.state.data.slice();
          data[this.state.edit.row][this.state.edit.cell] = input.value;
          this.setState({
            edit: null,
            data: data,
          });
        },
        
        _preSearchData: null,
        
        _toggleSearch: function() {
          if (this.state.search) {
            this.setState({
              data: this._preSearchData,
              search: false,
            });
            this._preSearchData = null;
          } else {
            this._preSearchData = this.state.data;
            this.setState({
              search: true,
            });
          }
        },
        
        _search: function(e) {
          var Lcase = e.target.value.toLowerCase();
          if (!Lcase) {
            this.setState({data: this._preSearchData});
            return;
          }
          var idx = e.target.dataset.idx;
          var searchdata = this._preSearchData.filter(function(row) {
            return row[idx].toString().toLowerCase().indexOf(Lcase) > -1;
          });
          this.setState({data: searchdata});
        },
        
        _download: function(format, ev) {
          var contents = format === 'json'
            ? JSON.stringify(this.state.data)
            : this.state.data.reduce(function(result, row) {
                return result
                  + row.reduce(function(rowresult, cell, idx) {
                      return rowresult 
                        + '"' 
                        + cell.replace(/"/g, '""')
                        + '"'
                        + (idx < row.length - 1 ? ',' : '');
                    }, '')
                  + "\n";
              }, '');

          var URL = window.URL || window.webkitURL;
          var blob = new Blob([contents], {type: 'text/' + format});
          ev.target.href = URL.createObjectURL(blob);
          ev.target.download = 'data.' + format;
        },
        
        render: function() {
          return (
            React.DOM.div(null,
              this._renderToolbar(),
              this._renderTable()
            )
          );
        },
        
        _renderToolbar: function() {
          return  React.DOM.div({className: 'toolbar'},
            React.DOM.button({
              onClick: this._toggleSearch,
            }, 'Search'),
            React.DOM.a({
              onClick: this._download.bind(this, 'json'),
              href: 'data.json',
            }, 'Export JSON'),
            React.DOM.a({
              onClick: this._download.bind(this, 'csv'),
              href: 'data.csv',
            }, 'Export CSV')
          );
        },
        
        _renderSearch: function() {
          if (!this.state.search) {
            return null;
          }
          return (
            React.DOM.tr({onChange: this._search},
              this.props.headers.map(function(_ignore, idx) {
                return React.DOM.td({key: idx},
                  React.DOM.input({
                    type: 'text',
                    'data-idx': idx,
                  })
                );
              })
            )
          );
        },
        
        _renderTable: function() {
          return (
            React.DOM.table(null,
              React.DOM.thead({onClick: this._sort},
                React.DOM.tr(null,
                  this.props.headers.map(function(title, idx) {
                    if (this.state.sortby === idx) {
                      title += this.state.descending ? ' \u2191' : ' \u2193';
                    }
                    return React.DOM.th({key: idx}, title);
                  }, this)
                )
              ),
              React.DOM.tbody({onDoubleClick: this._showEditor},
                this._renderSearch(),
                this.state.data.map(function(row, rowidx) {
                  return (
                    React.DOM.tr({key: rowidx},
                      row.map(function(cell, idx) {
                        var content = cell;
                        var edit = this.state.edit;
                        if (edit && edit.row === rowidx && edit.cell === idx) {
                          content = React.DOM.form({onSubmit: this._save},
                            React.DOM.input({
                              type: 'text',
                              defaultValue: cell,
                            })
                          );
                        }

                        return React.DOM.td({
                          key: idx,
                          'data-row': rowidx,
                        }, content);
                      }, this)
                    )
                  );
                }, this)
              )
            )
          );
        }
      });
var headers = [  "Book", "Author", "Language", "Published", "Sales" ];

var data = [  ["The Lord of the Rings", "J. R. R. Tolkien",    "English", "1954–1955", "150 million"],
  ["Le Petit Prince (The Little Prince)", "Antoine de Saint-Exupéry",    "French", "1943", "140 million"],
    ["Harry Potter and the Philosopher's Stone", "J. K. Rowling",    "English", "1997", "107 million"],
      ["And Then There Were None", "Agatha Christie",    "English", "1939", "100 million"],
        ["Dream of the Red Chamber", "Cao Xueqin",    "Chinese", "1754–1791", "100 million"],
         ["The Hobbit", "J. R. R. Tolkien",    "English", "1937", "100 million"],
           ["She: A History of Adventure", "H. Rider Haggard",    "English", "1887", "100 million"],
            ]; 
ReactDOM.render( React.createElement(Excel, 
{    headers: headers,
  initialData: data,

}),
document.getElementById('root')
);

// var ques  = [
// ['ques 1', 'ans1', 'ans2', 'ans3','A'],
// ['ques 2', 'ans1', 'ans2', 'ans3','B'],
// ['ques 3', 'ans1', 'ans2', 'ans3','C'],
// ['ques 4', 'ans1', 'ans2', 'ans3','D'],
// ['ques 5', 'ans1', 'ans2', 'ans3','A'],
// ['ques 6', 'ans1', 'ans2', 'ans3','D'],

// ];



// var position = 0, correct = 0, choice, percent;

// var myQuiz = React.createClass({

// getInitialState: function (){
// return{
//   correct: this.props.correct,
//   position: this.props.position,
//   question:this.props.data[position][0],
//   opt1: this.props.data[position][1],
//   opt2: this.props.data[position][2],
//   opt3: this.props.data[position][3],
//   opt4: this.props.data[position][4],
// }
// },
// _checkAnswer: function(e){
//   choices = document.getElementsByName('answer');
//   for(var i = 0; i <  choices.length; i++){
//     if(choices[i].checked){
//       choice = choices[i].value;
//     }
//   }
//   if(choice == this.props.data[position][4]){
//     this.setState({
//       correct: correct++
//     })
//   }
// this.setState({
//   position: ++position,
// })
// if(position < this.props.data.length){

// this.setState({
//   question: this.props.data[position][0],
//   opt1: this.props.data[position][1],
//   opt2: this.props.data[position][2],
//   opt3: this.props.data[position][3],
//   ans: this.props.data[position][4],
// })
// }
// },
// _showQuestion: function(){
//   if(this.state.position >= this.props.length )
//   {
//     percentage = correct * 10;
//     return React.DOM.div(
//       {
//         id: 'wrapper'
//       },
//       React.DOM.span({className:'resultBox'},
//       React.DOM.h2(null, ' percent'),

//       React.DOM.h2(null, percentage + '%')
//       ),
//       React.DOM.span({className:'resultBox'},
//       React.DOM.h2(null,'correctName'),
//       React.DOM.)
//     )
//   }

// }

// })









 


























































