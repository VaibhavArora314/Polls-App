import React from 'react';

function Option({option,colour}) {
    return (
        <div className={'row bg-light border border-' + colour + ' border-2 rounded-4 m-2 p-2 px-4'}>
            {option.description}
        </div>
    );
}

export default Option;