import styles from "../css/InputBox.module.scss";

export default function InputBox({ children, descHighlight, errMessage, inputName, inputType }) {
  return (
    <div className={styles.inputBox}>
      <div className={styles.descWrapper}>
        {
          descHighlight ?
            <span style={{ color: 'rgb(250, 119, 124)' }}>{children}</span> :
            <span >{children}</span>
        }
        {
          descHighlight ?
            <span style={{ color: 'rgb(250, 119, 124)', fontWeight: 400, fontStyle: 'italic' }}>{' - ' + errMessage}</span> :
            <></>
        }
      </div>

      <div className={styles.inputWrapper}>
        <input name={inputName} type={inputType ? inputType : 'text'} autoComplete='off' />
      </div>
    </div >
  )
}