import React, { Component } from 'react';
import requestAPI from '../services/battleship';

export default class Battleship extends Component {
    constructor() {
        super();
        this.state = {
            loading: true,
            menu: true,
            board: [],
            fragata: {
                placed: 0,
                max: 4,
                mov: 4,
                shot: 2,
            },
            crucero: {
                placed: 0,
                max: 3,
                mov: 3,
                shot: 2,
            },
            destructor: {
                placed: 0,
                max: 2,
                mov: 2,
                shot: 3,
            },
            portaviones: {
                placed: 0,
                max: 1,
                mov: 1,
                shot: 5,
            },
            ship: undefined,
            current_ships: 0,
            action: undefined,
            selected_ship: undefined,
            posible_target: [],
            surrender: undefined,
            logList: [],
            token: undefined,
            gameId: undefined,
            turn: 0,
            win: false,
            loose: false,
            blockedList: [],
        }
    }

    async componentDidMount() {
        const board = [...Array(100)]
        const response = await requestAPI.auth('mgecheverria@uc.cl', '15638812');
        this.setState({
            loading: false,
            board: board,
            token: response.token,
        });
    }

    async shipClick(n) {
        let { fragata, crucero, destructor, portaviones, ship } = this.state;
        if (n == 0) {
            this.setState({
                ship: 0,
            });
        } else if (n == 1) {
            this.setState({
                ship: 1,
            })
        } else if (n == 2) {
            this.setState({
                ship: 2,
            })
        } else if (n == 3) {
            this.setState({
                ship: 3,
            })
        } else {
            alert('All the available ships of this type have been placed');
        }
    }

    async placeShip(idx) {
        let { board, ship, fragata, crucero, destructor, portaviones, current_ships } = this.state;
        let boat = '';
        if (board[idx] != undefined) {
            alert('There is already a ship here!');
        } else {
            if (ship == 0) {
                fragata.placed += 1;
                boat = `F${fragata.placed}`;
                board[idx] = boat;
            } else if (ship == 1) {
                crucero.placed += 1;
                boat = `C${crucero.placed}`;
                board[idx] = boat;
            } else if (ship == 2) {
                destructor.placed += 1;
                boat = `D${destructor.placed}`;
                board[idx] = boat;
            } else if (ship == 3) {
                portaviones.placed += 1;
                boat = `P${portaviones.placed}`;
                board[idx] = boat;
            } else {
                alert('Select a ship to place');
            }
            
            current_ships = crucero.placed + fragata.placed + destructor.placed + portaviones.placed;
            this.setState({
                board: board,
                ship: undefined,
                fragata,
                crucero,
                destructor,
                portaviones,
                current_ships,
            })
        }
    }

    async reset() {
        let { fragata, crucero, destructor, portaviones, ship, board, menu, current_ships, posible_target, surrender, selected_ship, action, logList } = this.state;
        fragata.placed = 0;
        crucero.placed = 0;
        destructor.placed = 0;
        portaviones.placed = 0;
        ship = undefined;
        board = [...Array(100)];
        menu = true;
        current_ships = 0;
        action = undefined;
        selected_ship = undefined;
        posible_target = [];
        surrender = undefined;
        logList = [];

        this.setState({
            fragata,
            crucero,
            destructor,
            portaviones,
            ship,
            board,
            menu,
            current_ships,
            posible_target,
            surrender,
            selected_ship,
            action,
            logList,
            turn: 0,
            win: false,
            loose: false,
            blockedList: [],
        })
    }

    async play() {
        const { current_ships, token } = this.state;
        const response = await requestAPI.newGame(token);
        if (current_ships == 10) {
            this.setState({
                menu: false,
                gameId: response.gameId,
            })
        } else {
            alert('Place all your ships before playing');
        }
    }

    async actionClicked(n) {
        let action = this.state.action;
        if (((n == 0) || (n == 1)) && (action == undefined)) {
            this.setState({
                action: n,
                posible_target: [],
                selected_ship: undefined,
            })
        } else if (n == 2) {
            let surrender = this.state.surrender;
            if (surrender === undefined) {
                surrender = 1;
            } else {
                surrender = 2;
            }
            this.setState({
                surrender,
            })
        } else if (n == 3) {
            this.setState({
                action: undefined,
                selected_ship: undefined,
                posible_target: [],
                surrender: undefined,
            })
        } else if (action != undefined){
            alert('Cancel the current action to choose a different one!');
        }
    }

    async selectActionShip(s, pos) {
        const { action, board } = this.state;
        let rango;
        let posibles = [];
        if (s == 'F') {
            // Moverse
            if (action == 0) {
                rango = 4;
                posibles = board.map((item, idx) => {
                    if ((Math.abs(pos - idx) <= rango) && (Math.floor(idx/10) == Math.floor(pos/10)) && (idx != pos)) {
                        return idx
                    } else if ((Math.abs(Math.floor(idx/10) - Math.floor(pos/10)) <= rango) && (pos % 10 == idx % 10) && (idx != pos)) {
                        return idx
                    }
                })
            } else if (action == 1) {
                rango = 2;
                posibles = board.map((item, idx) => {
                    if ((Math.abs(pos - idx) <= rango) && (Math.floor(idx/10) == Math.floor(pos/10))) {
                        return idx
                    } else if ((Math.abs(Math.floor(idx/10) - Math.floor(pos/10)) <= rango) && (pos % 10 == idx % 10)) {
                        return idx
                    }
                })
            }
        } else if (s == 'C') {
            // Moverse
            if (action == 0) {
                rango = 3;
                posibles = board.map((item, idx) => {
                    if ((Math.abs(pos - idx) <= rango) && (Math.floor(idx/10) == Math.floor(pos/10)) && (idx != pos)) {
                        return idx
                    } else if ((Math.abs(Math.floor(idx/10) - Math.floor(pos/10)) <= rango) && (pos % 10 == idx % 10) && (idx != pos)) {
                        return idx
                    }
                })
            } else if (action == 1) {
                rango = 2;
                posibles = board.map((item, idx) => {
                    if ((Math.abs(pos - idx) <= rango) && (Math.floor(idx/10) == Math.floor(pos/10))) {
                        return idx
                    } else if ((Math.abs(Math.floor(idx/10) - Math.floor(pos/10)) <= rango) && (pos % 10 == idx % 10)) {
                        return idx
                    }
                })
            }
        } else if (s == 'D') {
            // Moverse
            if (action == 0) {
                rango = 2;
                posibles = board.map((item, idx) => {
                    if ((Math.abs(pos - idx) <= rango) && (Math.floor(idx/10) == Math.floor(pos/10)) && (idx != pos)) {
                        return idx
                    } else if ((Math.abs(Math.floor(idx/10) - Math.floor(pos/10)) <= rango) && (pos % 10 == idx % 10) && (idx != pos)) {
                        return idx
                    }
                })
            } else if (action == 1) {
                rango = 3;
                posibles = board.map((item, idx) => {
                    if ((Math.abs(pos - idx) <= rango) && (Math.floor(idx/10) == Math.floor(pos/10))) {
                        return idx
                    } else if ((Math.abs(Math.floor(idx/10) - Math.floor(pos/10)) <= rango) && (pos % 10 == idx % 10)) {
                        return idx
                    }
                })
            }
        } else if (s == 'P') {
            // Moverse
            if (action == 0) {
                rango = 1;
                posibles = board.map((item, idx) => {
                    if ((Math.abs(pos - idx) <= rango) && (Math.floor(idx/10) == Math.floor(pos/10)) && (idx != pos)) {
                        return idx
                    } else if ((Math.abs(Math.floor(idx/10) - Math.floor(pos/10)) <= rango) && (pos % 10 == idx % 10) && (idx != pos)) {
                        return idx
                    }
                })
            } else if (action == 1) {
                rango = 5;
                posibles = board.map((item, idx) => {
                    if ((Math.abs(pos - idx) <= rango) && (Math.floor(idx/10) == Math.floor(pos/10))) {
                        return idx
                    } else if ((Math.abs(Math.floor(idx/10) - Math.floor(pos/10)) <= rango) && (pos % 10 == idx % 10)) {
                        return idx
                    }
                })
            }
        }
        this.setState({
            selected_ship: pos,
            posible_target: posibles,
        })
    }

    async mov(idx) {
        const { selected_ship, gameId, token } = this.state;
        let { logList, board, current_ships, blockedList } = this.state;
        let aux1, aux2;

        board[idx] = board[selected_ship];
        board[selected_ship] = undefined;

        let pos = '';
        if (idx % 10 == 0) {
            pos = 'A' + String(Math.floor(idx/10) + 1);
        } else if (idx % 10 == 1) {
            pos = 'B' + String(Math.floor(idx/10) + 1);
        }  else if (idx % 10 == 2) {
            pos = 'C' + String(Math.floor(idx/10) + 1);
        }  else if (idx % 10 == 3) {
            pos = 'D' + String(Math.floor(idx/10) + 1);
        }  else if (idx % 10 == 4) {
            pos = 'E' + String(Math.floor(idx/10) + 1);
        }  else if (idx % 10 == 5) {
            pos = 'F' + String(Math.floor(idx/10) + 1);
        }  else if (idx % 10 == 6) {
            pos = 'G' + String(Math.floor(idx/10) + 1);
        }  else if (idx % 10 == 7) {
            pos = 'H' + String(Math.floor(idx/10) + 1);
        }  else if (idx % 10 == 8) {
            pos = 'I' + String(Math.floor(idx/10) + 1);
        }  else if (idx % 10 == 9) {
            pos = 'J' + String(Math.floor(idx/10) + 1);
        }

        let from = '';
        if (selected_ship % 10 == 0) {
            from = 'A' + String(Math.floor(selected_ship/10) + 1);
        } else if (selected_ship % 10 == 1) {
            from = 'B' + String(Math.floor(selected_ship/10) + 1);
        }  else if (selected_ship % 10 == 2) {
            from = 'C' + String(Math.floor(selected_ship/10) + 1);
        }  else if (selected_ship % 10 == 3) {
            from = 'D' + String(Math.floor(selected_ship/10) + 1);
        }  else if (selected_ship % 10 == 4) {
            from = 'E' + String(Math.floor(selected_ship/10) + 1);
        }  else if (selected_ship % 10 == 5) {
            from = 'F' + String(Math.floor(selected_ship/10) + 1);
        }  else if (selected_ship % 10 == 6) {
            from = 'G' + String(Math.floor(selected_ship/10) + 1);
        }  else if (selected_ship % 10 == 7) {
            from = 'H' + String(Math.floor(selected_ship/10) + 1);
        }  else if (selected_ship % 10 == 8) {
            from = 'I' + String(Math.floor(selected_ship/10) + 1);
        }  else if (selected_ship % 10 == 9) {
            from = 'J' + String(Math.floor(selected_ship/10) + 1);
        }

        let dir;
        let dist;
        if (selected_ship % 10 < idx % 10) {
            dir = 'EAST';
            dist = idx - selected_ship;
        } else if (selected_ship % 10 > idx % 10) {
            dir = 'WEST';
            dist = selected_ship - idx;
        } else if (Math.floor(selected_ship/10) < Math.floor(idx/10)) {
            dir = 'SOUTH';
            dist = Math.abs(Math.floor(idx/10) - Math.floor(selected_ship/10));
        } else {
            dir = 'NORTH';
            dist = Math.abs(Math.floor(idx/10) - Math.floor(selected_ship/10));
        }
        let msg = `[USER]: MOVE - ${board[idx]} - ${dir} - ${dist}`;
        logList.unshift(msg);

        this.setState({
            logList,
            turn: 1,
            posible_target: [],
            action: undefined,
            selected_ship: undefined,
        });

        const response = await requestAPI.playerMoved(from, dir, dist, gameId, token);
        if (response.action.type == 'FIRE') {
            let hit_idx = (response.action.row*10) + response.action.column+1;
            let to = '';
            if (hit_idx % 10 == 0) {
                to = 'A' + String(Math.floor(hit_idx/10) + 1);
            } else if (hit_idx % 10 == 1) {
                to = 'B' + String(Math.floor(hit_idx/10) + 1);
            }  else if (hit_idx % 10 == 2) {
                to = 'C' + String(Math.floor(hit_idx/10) + 1);
            }  else if (hit_idx % 10 == 3) {
                to = 'D' + String(Math.floor(hit_idx/10) + 1);
            }  else if (hit_idx % 10 == 4) {
                to = 'E' + String(Math.floor(hit_idx/10) + 1);
            }  else if (hit_idx % 10 == 5) {
                to = 'F' + String(Math.floor(hit_idx/10) + 1);
            }  else if (hit_idx % 10 == 6) {
                to = 'G' + String(Math.floor(hit_idx/10) + 1);
            }  else if (hit_idx % 10 == 7) {
                to = 'H' + String(Math.floor(hit_idx/10) + 1);
            }  else if (hit_idx % 10 == 8) {
                to = 'I' + String(Math.floor(hit_idx/10) + 1);
            }  else if (hit_idx % 10 == 9) {
                to = 'J' + String(Math.floor(hit_idx/10) + 1);
            }
            msg = `[COMPUTER]: FIRE - ${response.action.ship} - ${to}`;
            logList.unshift(msg);
            if (board[hit_idx] != undefined) {
                msg = `[USER]: [HIT] Ship ${board[hit_idx]}`;
                logList.unshift(msg);
                msg = `[USER]: [DESTROYED] Ship ${board[hit_idx]}`;
                board[hit_idx] = undefined;
                blockedList.push(hit_idx);
                current_ships -= 1;
                if (current_ships == 0) {
                    this.setState({
                        loose: true,
                    });
                }
                logList.unshift(msg);
            }
        } else if (response.action.type == 'MOVE') {
            msg = `[COMPUTER]: MOVE - ${response.action.ship} - ${response.action.direction} - ${response.action.quantity}`;
            logList.unshift(msg);
        }

        this.setState({
            logList,
            board,
            current_ships,
            turn: 0,
            blockedList,
        })
    }

    async shoot(idx, pos) {
        // TODO Revisar si le achunto

        const { selected_ship, token, gameId } = this.state;
        let { logList, board, blockedList, current_ships } = this.state;

        let from = '';
        if (selected_ship % 10 == 0) {
            from = 'A' + String(Math.floor(selected_ship/10) + 1);
        } else if (selected_ship % 10 == 1) {
            from = 'B' + String(Math.floor(selected_ship/10) + 1);
        }  else if (selected_ship % 10 == 2) {
            from = 'C' + String(Math.floor(selected_ship/10) + 1);
        }  else if (selected_ship % 10 == 3) {
            from = 'D' + String(Math.floor(selected_ship/10) + 1);
        }  else if (selected_ship % 10 == 4) {
            from = 'E' + String(Math.floor(selected_ship/10) + 1);
        }  else if (selected_ship % 10 == 5) {
            from = 'F' + String(Math.floor(selected_ship/10) + 1);
        }  else if (selected_ship % 10 == 6) {
            from = 'G' + String(Math.floor(selected_ship/10) + 1);
        }  else if (selected_ship % 10 == 7) {
            from = 'H' + String(Math.floor(selected_ship/10) + 1);
        }  else if (selected_ship % 10 == 8) {
            from = 'I' + String(Math.floor(selected_ship/10) + 1);
        }  else if (selected_ship % 10 == 9) {
            from = 'J' + String(Math.floor(selected_ship/10) + 1);
        }

        let msg = `[USER]: FIRE - ${board[selected_ship]} - ${pos}`;
        logList.unshift(msg);

        this.setState({
            logList,
            posible_target: [],
            selected_ship: undefined,
            action: undefined,
            turn: 1,
        });

        let row = (idx % 10);
        let column = Math.floor(idx/10);

        const response = await requestAPI.playerShot(token, gameId, from, row, column);
        if (response.events.length) {
            for (const [key, value] of Object.entries(response.events)) {
                alert(value.type);
                if (value.type == 'HIT_SHIP') {
                    msg = `[COMPUTER]: [HIT] Ship ${value.ship}`
                    logList.unshift(msg);
                }
                if (value.type == 'SHIP_DESTROYED') {
                    msg = `[COMPUTER]: [Destroyed] Ship ${value.ship}`
                    logList.unshift(msg);
                }
                if (value.type == 'ALL_SHIPS_DESTROYED') {
                    this.setState({
                        win: true,
                    });
                }
            }
            this.setState({
                logList,
            })
        }
        if (response.action.type == 'MOVE') {
            if (response.action.type == 'MOVE') {
                msg = `[COMPUTER]: MOVE - ${response.action.ship} - ${response.action.direction} - ${response.action.quantity}`;
                logList.unshift(msg);
            }
        } else if (response.action.type == 'FIRE') {
            let hit_idx = (response.action.row*10) + response.action.column+1;
            let to = '';
            if (hit_idx % 10 == 0) {
                to = 'A' + String(Math.floor(hit_idx/10) + 1);
            } else if (hit_idx % 10 == 1) {
                to = 'B' + String(Math.floor(hit_idx/10) + 1);
            }  else if (hit_idx % 10 == 2) {
                to = 'C' + String(Math.floor(hit_idx/10) + 1);
            }  else if (hit_idx % 10 == 3) {
                to = 'D' + String(Math.floor(hit_idx/10) + 1);
            }  else if (hit_idx % 10 == 4) {
                to = 'E' + String(Math.floor(hit_idx/10) + 1);
            }  else if (hit_idx % 10 == 5) {
                to = 'F' + String(Math.floor(hit_idx/10) + 1);
            }  else if (hit_idx % 10 == 6) {
                to = 'G' + String(Math.floor(hit_idx/10) + 1);
            }  else if (hit_idx % 10 == 7) {
                to = 'H' + String(Math.floor(hit_idx/10) + 1);
            }  else if (hit_idx % 10 == 8) {
                to = 'I' + String(Math.floor(hit_idx/10) + 1);
            }  else if (hit_idx % 10 == 9) {
                to = 'J' + String(Math.floor(hit_idx/10) + 1);
            }
            msg = `[COMPUTER]: FIRE - ${response.action.ship} - ${to}`;
            logList.unshift(msg);
            if (board[hit_idx] != undefined) {
                msg = `[USER]: [HIT] Ship ${board[hit_idx]}`;
                logList.unshift(msg);
                msg = `[USER]: [DESTROYED] Ship ${board[hit_idx]}`;
                board[hit_idx] = undefined;
                blockedList.push(hit_idx);
                logList.unshift(msg);
                current_ships -= 1;
                if (current_ships == 0) {
                    alert('You have lost!');
                    this.setState({
                        current_ships,
                        loose: true,
                    })
                }
            }
        }

        this.setState({
            turn: 0,
            blockedList,
        })
        
    }

    render() {
        const { loading, menu, fragata, crucero, destructor, portaviones, action, selected_ship, posible_target, surrender, turn, blockedList, win, loose } = this.state;
        let { logList, board, ship } = this.state;
        let buttons, buttonsTitle;

        if (menu) {
            let fragataButton, cruceroButton, destructorButton, portavionesButton, playButton, resetButton, selected;
            // Fragata
            if ((fragata.max - fragata.placed) > 0) {
                fragataButton = <button onClick={() => {this.shipClick(0)}}>Fragata ({fragata.max - fragata.placed})</button>
            } else {
                fragataButton = <button onClick={() => {this.shipClick(4)}}>Fragata ({fragata.max - fragata.placed})</button>
            }
            // Crucero
            if ((crucero.max - crucero.placed) > 0) {
                cruceroButton = <button onClick={() => {this.shipClick(1)}}>Crucero ({crucero.max - crucero.placed})</button>
            } else {
                cruceroButton = <button onClick={() => {this.shipClick(4)}}>Crucero ({crucero.max - crucero.placed})</button>
            }
            // Destructor
            if ((destructor.max - destructor.placed) > 0) {
                destructorButton = <button onClick={() => {this.shipClick(2)}}>Destructor ({destructor.max - destructor.placed})</button>
            } else {
                destructorButton = <button onClick={() => {this.shipClick(4)}}>Destructor ({destructor.max - destructor.placed})</button>
            }
            // Portaviones
            if ((portaviones.max - portaviones.placed) > 0) {
                portavionesButton = <button onClick={() => {this.shipClick(3)}}>Portaviones ({portaviones.max - portaviones.placed})</button>
            } else {
                portavionesButton = <button onClick={() => {this.shipClick(4)}}>Portaviones ({portaviones.max - portaviones.placed})</button>
            }
            if (ship === undefined) {
                selected = <p>Selected: None</p>;
            } else if (ship == 0) {
                selected = <p>Selected: Fragata</p>;
            } else if (ship == 1) {
                selected = <p>Selected: Crucero</p>;
            } else if (ship == 2) {
                selected = <p>Selected: Destructor</p>;
            } else if (ship == 3) {
                selected = <p>Selected: Portaviones</p>;
            }
            
            playButton = <button onClick={() => this.play()}>Play</button>;
            resetButton = <button onClick={() => this.reset()}>Reset</button>;
            buttons = [selected, fragataButton, cruceroButton, destructorButton, portavionesButton, playButton, resetButton];
            buttonsTitle = <h3>Select a ship and then select a place</h3>
        } else {
            let moveButton, fireButton, surrenderButton, cancelButton, selected;
            if (action === undefined) {
                selected = <p>Selected: None</p>;
            } else if (action == 0) {
                selected = <p>Selected: Move</p>;
            } else if (action == 1) {
                selected = <p>Selected: Fire</p>;
            }
            buttonsTitle = <h3>Select an action</h3>;
            moveButton = <button onClick={() => this.actionClicked(0)}>Move</button>;
            fireButton = <button onClick={() => this.actionClicked(1)}>Fire</button>;
            surrenderButton = <button onClick={() => this.actionClicked(2)}>Surrender</button>;
            cancelButton = <button onClick={() => this.actionClicked(3)}>Cancel</button>;
            buttons = [selected, moveButton, fireButton, surrenderButton, cancelButton];
            let surrenderDiag = [
                <p>Do you want to surrender?</p>,
                <button onClick={() => this.actionClicked(2)}>Yes</button>,
                <button onClick={() => this.actionClicked(3)}>No</button>
            ];
            let resetButton = <button onClick={() => this.reset()}>Reset</button>;
            if (surrender == 1) {
                buttons = surrenderDiag;
            } else if (surrender == 2) {
                buttons = [
                    <p>You Lost! Press reset to try again!</p>,
                    resetButton
                ];
            }

            if (win) {
                buttonsTitle = [
                    <h3>You have won!</h3>,
                    <p>Do you want to play again?</p>,
                ];
                buttons = [
                    <button onClick={() => this.reset()}>Yes</button>,
                    <button onClikc={() => alert('Close this tab to leave :)')}>No</button>
                ];
            } else if (loose) {
                buttonsTitle = [
                    <h3>You have lost!</h3>,
                    <p>Do you want to play again?</p>
                ];
                buttons = [
                    <button onClick={() => this.reset()}>Yes</button>,
                    <button onClikc={() => alert('Close this tab to leave :)')}>No</button>
                ];
            }
        }

        if (turn == 1) {
            buttons = <p>Waiting for the COMPUTER to make it's play</p>
        }

        if (menu) {
            board = board.map((item, idx) => {
                let pos = '';
                if (idx % 10 == 0) {
                    pos = 'A' + String(Math.floor(idx/10) + 1);
                } else if (idx % 10 == 1) {
                    pos = 'B' + String(Math.floor(idx/10) + 1);
                }  else if (idx % 10 == 2) {
                    pos = 'C' + String(Math.floor(idx/10) + 1);
                }  else if (idx % 10 == 3) {
                    pos = 'D' + String(Math.floor(idx/10) + 1);
                }  else if (idx % 10 == 4) {
                    pos = 'E' + String(Math.floor(idx/10) + 1);
                }  else if (idx % 10 == 5) {
                    pos = 'F' + String(Math.floor(idx/10) + 1);
                }  else if (idx % 10 == 6) {
                    pos = 'G' + String(Math.floor(idx/10) + 1);
                }  else if (idx % 10 == 7) {
                    pos = 'H' + String(Math.floor(idx/10) + 1);
                }  else if (idx % 10 == 8) {
                    pos = 'I' + String(Math.floor(idx/10) + 1);
                }  else if (idx % 10 == 9) {
                    pos = 'J' + String(Math.floor(idx/10) + 1);
                }

                if (item == undefined) {
                    return (
                        <div className='grid-item-empty' onClick={() => {this.placeShip(idx)}}>
                            <p>{item}<small>({pos})</small></p>
                        </div>
                    )
                } else {
                    return (
                        <div className='grid-item' onClick={() => {this.placeShip(idx)}}>
                            <img src={require('./../../images/battleship.jpg')} />
                            <p>{item} ({pos})</p>
                        </div>
                    )
                }
            })
        } else {
            logList = logList.map((item) => {
                return <p>{item}</p>
            })
            board = board.map((item, idx) => {
                let pos = '';
                if (idx % 10 == 0) {
                    pos = 'A' + String(Math.floor(idx/10) + 1);
                } else if (idx % 10 == 1) {
                    pos = 'B' + String(Math.floor(idx/10) + 1);
                }  else if (idx % 10 == 2) {
                    pos = 'C' + String(Math.floor(idx/10) + 1);
                }  else if (idx % 10 == 3) {
                    pos = 'D' + String(Math.floor(idx/10) + 1);
                }  else if (idx % 10 == 4) {
                    pos = 'E' + String(Math.floor(idx/10) + 1);
                }  else if (idx % 10 == 5) {
                    pos = 'F' + String(Math.floor(idx/10) + 1);
                }  else if (idx % 10 == 6) {
                    pos = 'G' + String(Math.floor(idx/10) + 1);
                }  else if (idx % 10 == 7) {
                    pos = 'H' + String(Math.floor(idx/10) + 1);
                }  else if (idx % 10 == 8) {
                    pos = 'I' + String(Math.floor(idx/10) + 1);
                }  else if (idx % 10 == 9) {
                    pos = 'J' + String(Math.floor(idx/10) + 1);
                }

                if (item === undefined) {
                    if (blockedList.includes(idx) && ((action == 0) || (!posible_target.includes(idx)))) {
                        return (
                            <div className='blocked'>
                                <p>X<small>({pos})</small></p>
                            </div>
                        )
                    }
                    if ((posible_target.includes(idx)) && (action == 0) && (!blockedList.includes(idx))) {
                        return (
                            <div className='grid-item-empty posible-mov' onClick={() => this.mov(idx)}>
                                <p>{item}<small>({pos})</small></p>
                            </div>
                        )
                    } else if ((posible_target.includes(idx)) && (action == 1)) {
                        return (
                            <div className='grid-item-empty posible-shot' onClick={() => this.shoot(idx, pos)}>
                                <p>{item}<small>({pos})</small></p>
                            </div>
                        )
                    } else {
                        return (
                            <div className='grid-item-empty'>
                                <p>{item}<small>({pos})</small></p>
                            </div>
                        )
                    }
                } else {
                    if (selected_ship === undefined) {
                        if (action === undefined) {
                            return (
                                <div className='grid-item' onClick={() => alert('Select an action to perform!')}>
                                    <img src={require('./../../images/battleship.jpg')} />
                                    <p>{item} ({pos})</p>
                                </div>
                            )
                        } else if (action == 0) {
                            return (
                                <div className='grid-item select-ship' onClick={() => this.selectActionShip(item.charAt(0), idx)}>
                                    <img src={require('./../../images/battleship.jpg')} />
                                    <p>{item} ({pos})</p>
                                </div>
                            )
                        } else if (action == 1) {
                            return (
                                <div className='grid-item select-ship' onClick={() => this.selectActionShip(item.charAt(0), idx)}>
                                    <img src={require('./../../images/battleship.jpg')} />
                                    <p>{item} ({pos})</p>
                                </div>
                            )
                        }
                    } else {
                        if ((idx == selected_ship) && (action == 0)) {
                            return (
                                <div className='grid-item select-ship' onClick={() => this.selectActionShip(item.charAt(0), idx)}>
                                    <img src={require('./../../images/battleship.jpg')} />
                                    <p>{item} ({pos})</p>
                                </div>
                            )
                        } else if((posible_target.includes(idx)) && (action == 1)) {
                            return (
                                <div className='grid-item posible-shot' onClick={() => this.shoot(idx, pos)}>
                                    <img src={require('./../../images/battleship.jpg')} />
                                    <p>{item} ({pos})</p>
                                </div>
                            )
                        } else {
                            return (
                                <div className='grid-item'>
                                    <img src={require('./../../images/battleship.jpg')} />
                                    <p>{item} ({pos})</p>
                                </div>
                            )
                        }
                    }
                }
            })
        }

        return (
            <div className='main'>
                <div className='row'>
                    <div className='column'>
                        <div className='board'>
                            { board }
                        </div>
                    </div>
                    <div className='column'>
                        <div className='row'>
                            <div>
                                { buttonsTitle }
                                { buttons }
                            </div>
                        </div>
                        <div className='row'>
                            <div className='column'>
                                <h3>Log</h3>
                                <div className='log-wrapper'>
                                    { logList }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}