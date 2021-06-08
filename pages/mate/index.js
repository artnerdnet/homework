import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import emailjs from "emailjs-com";

export default function Home() {
  const [numbers, setNumbers] = useState([]);
  const [result, setResult] = useState(0);
  const [displayResult, setDisplayResult] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const generateNewSum = () => {
    const newRandomNum = [
      Math.floor(Math.random() * 9) + 1,
      Math.floor(Math.random() * 9) + 1,
    ];
    return newRandomNum;
  };

  const StyledResult = styled.div`
    margin: 12px;
    text-align: center;
    min-width: 150px;
    display: ${(props) => (props.isDisplayed ? "inline" : "none")};
  `;



  const StyledButton = styled.button`
    color: #000;
    border: none;
    padding: 12px;
    border-radius: 25px;
    min-width: 150px;
`;

  const StyledShowResult = styled(StyledButton)`
    background: #63264A;
    color: #fff;
    display: ${(props) => (props.isDisplayed ? "inline" : "none")};
  `;

  const StyledSendResult = styled(StyledButton)`
    background: #C0D684;
  `;

  const StyledMate = styled.div`
    max-width: 40%;
    margin: 0 auto;
    text-align: center;
  `;

  const StyledSiguiente = styled(StyledButton)`
    background: #2F3061;
    color: #fff;
  `

  useEffect(() => {
    if (numbers.length === 0) {
      const newSumNumbers = generateNewSum();
      setNewSumValues(newSumNumbers);
    }
  }, [numbers]);

  const handleSubmit = (value) => {
    if (value == result) {
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
      }, 900);
    }
  };

  const setNewSumValues = (sumNumbers) => {
    setNumbers(sumNumbers);
    setResult(sumNumbers[0] + sumNumbers[1]);
  };

  const handleNewSum = () => {
    handleShowResult(false);
    const newSumNumbers = generateNewSum();
    setNewSumValues(newSumNumbers);
  };

  const handleShowResult = (bool = true) => {
    setDisplayResult(bool);
  };

  const StyledSumContainer = styled.div`
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
  `;

  const StyledSum = styled.div`
    font-size: 24px;
  `;
  const formRef = useRef();

  const StyledInput = styled.input`
    border: none;
    background: #f1f1;
    border-radius: 25px;
    min-height: 40px;
    text-align:center;
    padding: 8px;
  `;

  const StyledHeader = styled.div`
    font-size: 24px;
    text-align: center;
    margin: 12px;
  `

  const StyledMenu = styled.div`
    margin: 20px;
  `

  const StyledHr = styled.hr`
    max-width: 60%;
  `

  const sendForm = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const answer = form.get("answer");
    handleSubmit(answer);
    const templateParams = {
      sum: numbers,
      result: result,
      answer: answer,
    };
    emailjs
      .send(
        process.env.NEXT_PUBLIC_EMAIL_SERVICE,
        process.env.NEXT_PUBLIC_EMAIL_TEMPLATE,
        templateParams,
        process.env.NEXT_PUBLIC_EMAIL_USER
      )
      .then(
        () => {
          handleNewSum()
        },
        (err) => {
          console.log(err, 'error')
        }
      );
    formRef.current.reset();
  };

  return (
    <>
      <StyledHeader>A sumar!</StyledHeader>
      {numbers.length > 0 && (
        <StyledMate>
          <StyledSumContainer>
            <StyledSum>+</StyledSum>
            <StyledSum>
              <div>{numbers[0]}</div>
              <div>{numbers[1]}</div>
            </StyledSum>
          </StyledSumContainer>
          <div>
            <StyledHr />
            <form ref={formRef} onSubmit={(e) => sendForm(e)}>
              <div>
                <StyledInput name="answer" placeholder="escribe el resultado"></StyledInput>
              </div>
              <StyledSendResult type="submit" disabled={displayResult}>
                Enviar resultado
              </StyledSendResult>
            </form>
            <StyledMenu>
            <StyledResult isDisplayed={displayResult}>
              Resultado: {result}
            </StyledResult>
            <StyledShowResult
              isDisplayed={!displayResult}
              onClick={handleShowResult}
            >
              Mostrar resultado
            </StyledShowResult>

            <div> {isSuccess && <div>Correcto!</div>}</div>
          <StyledSiguiente onClick={handleNewSum}>Siguiente suma</StyledSiguiente>
            </StyledMenu>
          </div>
        
        </StyledMate>
      )}
    </>
  );
}
