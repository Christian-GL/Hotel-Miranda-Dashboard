
import { DefaultTheme } from "styled-components"
import { StylesConfig } from "react-select"


export const reactSelectStyles = (theme: DefaultTheme): StylesConfig => ({
    // Usar estos estilos para diseño interno y los de "styled-components" para diseño general.
    // Mantener "...base" para conservar los valores por defecto no especificados.

    // Equivale al input del select:
    control: (base: any, state: any) => ({
        ...base,
        textAlign: 'left',
        border: `1px solid ${theme.borderElementForm}`,
        boxShadow: 'none',
        '&:hover': {
            borderColor: theme.borderElementHoverForm
        }
    }),
    // Cuadro flotante que contiene las opciones:
    menu: (base: any) => ({
        ...base,
        textAlign: 'left',
        backgroundColor: theme.backgroundElementForm
    }),
    option: (base: any, state: any) => ({
        ...base,
        backgroundColor: state.isSelected ? theme.optionHoverForm : theme.backgroundElementForm,
        '&:hover': {
            backgroundColor: theme.optionHoverForm
        }
    }),
    multiValue: (base: any) => ({
        ...base,
        backgroundColor: theme.backgroundElementForm
    }),
    multiValueLabel: (base: any) => ({
        ...base,
        color: theme.textForm,
    }),
    multiValueRemove: (base: any) => ({
        ...base,
        color: theme.textForm,
        ':hover': {
            color: theme.textForm,
            backgroundColor: theme.optionHoverForm
        }
    }),
    placeholder: (base) => ({
        ...base,
    })
})