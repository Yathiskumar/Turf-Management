import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 20px;
`;

export const FormColumn = styled.div`
  flex: 1;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
`;

export const Label = styled.label`
  font-weight: bold;
  margin-bottom: 8px;
  color: orange;
`;

export const StyledInput = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
`;

export const StyledSelect = styled.select`
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 12px;
  width: 100%;
  height : 38px;
`;

export const SubmitContainer = styled.div`
  margin: none;
  text-align: center;
`;
