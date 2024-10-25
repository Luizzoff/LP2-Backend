import { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";

export default function FormCadastroCategoria(props) {
  const [formValidado, setFormValidado] = useState(false);
  const categoriaReseta = {
    codigo: "",
    descricao: ""
  };

  function manipularSubmissao(evento) {
    const form = evento.currentTarget;
    if (form.checkValidity()) {
      if (!props.modoEdicao) {
        props.setListaCategorias([
          ...props.listaCategorias,
          props.categoriaSelecionado,
        ]);
        window.alert("Categoria inserida com sucesso!");
        props.setExibirCategorias(true);
      } else {
        props.setListaCategorias(
          props.listaCategorias.map((item) =>
            item.codigo === props.categoriaSelecionado.codigo
              ? props.categoriaSelecionado
              : item
          )
        );
        window.alert("Categoria atualizada com sucesso!");
        props.setModoEdicao(false);
        props.setExibirCategorias(true);
      }
      props.setCategoriaSelecionado(categoriaReseta);
    } else {
      setFormValidado(true);
    }
    evento.preventDefault();
    evento.stopPropagation();
  }

  function manipularMudanca(evento) {
    const elemento = evento.target.name;
    const valor = evento.target.value;
    props.setCategoriaSelecionado({
      ...props.categoriaSelecionado,
      [elemento]: valor,
    });
  }

  return (
    <Form noValidate validated={formValidado} onSubmit={manipularSubmissao}>
      {/* ########## Codigo ########## */}
      <Form.Group className="mb-3" controlId="formGroupCodigo">
        <Form.Label>Código</Form.Label>
        <Form.Control
          required
          disabled={props.modoEdicao}
          id="codigo"
          name="codigo"
          value={props.categoriaSelecionado.codigo}
          onChange={manipularMudanca}
          type="text"
          placeholder="Código"
        />
        <Form.Control.Feedback type="invalid">
          Por favor, informe o codigo!
        </Form.Control.Feedback>
      </Form.Group>
      {/* ########## Descricao ########## */}
      <Form.Group className="mb-3" controlId="formGroupDescricao">
        <Form.Label>Descrição</Form.Label>
        <Form.Control
          required
          id="descricao"
          name="descricao"
          value={props.categoriaSelecionado.descricao}
          onChange={manipularMudanca}
          type="text"
          placeholder="Descrição"
        />
        <Form.Control.Feedback type="invalid">
          Por favor, informe a descrição.
        </Form.Control.Feedback>
      </Form.Group>
      <Row className="mt-2 mb-2">
        <Col md={2}>
          <Button type="submit"variant={props.modoEdicao ? "warning":"success"}>
          {props.modoEdicao ? "Alterar":"Confirmar"}
          </Button>{" "}
        </Col>
        <Col>
          <Button
            onClick={() => {
              props.setModoEdicao(false);
              props.setCategoriaSelecionado(categoriaReseta);
              props.setExibirCategorias(true);
            }}
            type="button"
            variant={props.modoEdicao ? "warning":"success"}
          >
            Voltar
          </Button>
        </Col>
      </Row>
    </Form>
  );
}
