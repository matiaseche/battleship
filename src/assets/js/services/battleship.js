async function auth(email, studentNumber) {
    const url = 'https://battleship.iic2513.phobos.cl/auth';
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            studentNumber,
        }),
    });

    return response.json();
}

async function newGame(token) {
    const url = 'https://battleship.iic2513.phobos.cl/games';
    const response = await fetch(url, {
        method: 'POST',
        withCredentials: true,
        headers: {
            'Authorization': 'Bearer ' + token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
    });

    return response.json();
}

async function playerMoved(from, dir, qty, gameId, token) {
    const url = `https://battleship.iic2513.phobos.cl/games/${gameId}/action`;
    const response = await fetch(url, {
        method: 'POST',
        withCredentials: true,
        headers: {
            'Authorization': 'Bearer ' + token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'action': {
                'type': 'MOVE',
                'ship': from,
                'direction': dir,
                'quantity': qty,
            },
        }),
    });

    return response.json();
}

async function playerShot(token, gameId, from, row, column) {
    const url = `https://battleship.iic2513.phobos.cl/games/${gameId}/action`;
    const response = await fetch(url, {
        method: 'POST',
        withCredentials: true,
        headers: {
            'Authorization': 'Bearer ' + token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'action': {
                'type': 'FIRE',
                'ship': from,
                'row': row,
                'column': column,
            },
        }),
    });

    return response.json();

}

export default {
    auth,
    newGame,
    playerMoved,
    playerShot,
};