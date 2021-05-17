import React, { useEffect} from 'react';

function Show( {query} ) {

  const getCoinData = () => {
    console.log('get coindata!', query)
  }

  useEffect(() => {
    //getCoinData()
  })

  return (
    <div>
      Show Page - Make the API call with useEffect and show results here
      <div>
        {query.crypto}
      </div>
      
    </div>
  )
}

export default Show