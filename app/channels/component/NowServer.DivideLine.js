const DivideLine = ({ direction, backgroundColor }) => {
  return (
    <div style={{
      width: direction === 'row' ? '1px' : '100%',
      height: direction === 'column' ? '1px' : '100%',
      backgroundColor,
    }}>

    </div>
  )
}

export default DivideLine;