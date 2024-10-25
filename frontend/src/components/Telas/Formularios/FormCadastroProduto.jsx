import { useEffect, useState } from "react";
import { Col, Form, Row, Button } from "react-bootstrap";
import { consultar } from "../../../services/servicoCategoria"

export default function FormCadastroProduto(props) {
	const [formValidado, setFormValidado] = useState(false);
	const [categorias, setCategorias] = useState([]);
	const produtoReseta = {
		codigo: "",
		dataValidade: "",
		descricao: "",
		precoCusto: "",
		precoVenda: "",
		qtdEstoque: "",
		urlImagem: ""
	};

	useEffect(() => {
		consultar()
			.then((res) => {
				if (Array.isArray(res))
					setCategorias(res);
			})
	}, [])

	function manipularSubmissao(evento) {
		const form = evento.currentTarget;
		if (form.checkValidity()) {
			if (!props.modoEdicao) {
				props.setListaProdutos([
					...props.listaProdutos,
					props.produtoSelecionado,
				]);
				window.alert("Produto inserido com sucesso!");
				props.setExibirProdutos(true);
			} else {
				props.setListaProdutos(
					props.listaProdutos.map((item) =>
						item.codigo === props.produtoSelecionado.codigo
							? props.produtoSelecionado
							: item
					)
				);
				window.alert("Produto atualizado com sucesso!");
				props.setModoEdicao(false);
				props.setExibirProdutos(true);
			}
			props.setProdutoSelecionado(produtoReseta);
		} else {
			setFormValidado(true);
		}
		evento.preventDefault();
		evento.stopPropagation();
	}

	function manipularMudanca(evento) {
		const elemento = evento.target.name;
		const valor = evento.target.value;
		props.setProdutoSelecionado({
			...props.produtoSelecionado,
			[elemento]: valor,
		});
	}

	return (
		<Form noValidate validated={formValidado} onSubmit={manipularSubmissao}>
			<Row>
				<Col>
					{/* ########## Código ########## */}
					<Form.Group className="mb-3">
						<Form.Label>Categoria</Form.Label>
						<Form.Select id='categoria' name='categoria'>
							<option value="">Selecionar</option>
							{
								categorias.map((categoria) => {
									return <option value={categoria.codigo}>
										{categoria.descricao}
									</option>
								})
							}
						</Form.Select>
						{/* <Form.Control
              required
              disabled={props.modoEdicao}
              type="number"
              id="codigo"
              name="codigo"
              value={props.produtoSelecionado.codigo}
              onChange={manipularMudanca}
              placeholder="Código"
            /> */}
						{/* <Form.Control.Feedback type="invalid">
              Por favor, informe o código do produto!
            </Form.Control.Feedback> */}
					</Form.Group>
				</Col>
				<Col>
					{/* ########## Validade ########## */}
					<Form.Group className="mb-3">
						<Form.Label>Válido até: </Form.Label>
						<Form.Control
							required
							type="date"
							id="dataValidade"
							name="dataValidade"
							value={props.produtoSelecionado.dataValidade}
							onChange={manipularMudanca}
							placeholder="Válido até:"
						/>
						<Form.Control.Feedback type="invalid">
							Por favor, informe a data de validade!
						</Form.Control.Feedback>
					</Form.Group>
				</Col>
				<Col>
					{/* ########## Descrição ########## */}
					<Form.Group className="mb-3">
						<Form.Label>Descrição:</Form.Label>
						<Form.Control
							required
							type="text"
							id="descricao"
							name="descricao"
							value={props.produtoSelecionado.descricao}
							onChange={manipularMudanca}
							placeholder="Descrição:"
						/>
						<Form.Control.Feedback type="invalid">
							Por favor, informe a descrição do produto!
						</Form.Control.Feedback>
					</Form.Group>
				</Col>
			</Row>
			<Row>
				<Col>
					{/* ########## Preço Custo ########## */}
					<Form.Group className="mb-3">
						<Form.Label>Preço de Custo:</Form.Label>
						<Form.Control
							required
							type="number"
							placeholder="Preço de Custo:"
							id="precoCusto"
							name="precoCusto"
							value={props.produtoSelecionado.precoCusto}
							onChange={manipularMudanca}
						/>
						<Form.Control.Feedback type="invalid">
							Por favor, informe o preço de custo deste produto!
						</Form.Control.Feedback>
					</Form.Group>
				</Col>
				<Col>
					{/* ########## Preço Venda ########## */}
					<Form.Group className="mb-3">
						<Form.Label>Preço de Venda:</Form.Label>
						<Form.Control
							required
							type="number"
							placeholder="Preço de Venda:"
							id="precoVenda"
							name="precoVenda"
							value={props.produtoSelecionado.precoVenda}
							onChange={manipularMudanca}
						/>
						<Form.Control.Feedback type="invalid">
							Por favor, informe o preço de venda deste produto!
						</Form.Control.Feedback>
					</Form.Group>
				</Col>
				<Col>
					{/* ########## Estoque ########## */}
					<Form.Group className="mb-3">
						<Form.Label>Estoque:</Form.Label>
						<Form.Control
							required
							type="number"
							id="qtdEstoque"
							name="qtdEstoque"
							value={props.produtoSelecionado.qtdEstoque}
							onChange={manipularMudanca}
							placeholder="Estoque:"
						/>
						<Form.Control.Feedback type="invalid">
							Por favor, informe a quantidade em estoque deste produto!
						</Form.Control.Feedback>
					</Form.Group>
				</Col>
			</Row>
			<Row>
				<Col>
					{/* ########## URL Imagem ########## */}
					<Form.Group className="mb-3">
						<Form.Label>URL da Imagem:</Form.Label>
						<Form.Control
							required
							type="url"
							id="urlImagem"
							name="urlImagem"
							value={props.produtoSelecionado.urlImagem}
							onChange={manipularMudanca}
							placeholder="URL da Imagem:"
						/>
						<Form.Control.Feedback type="invalid">
							Por favor, informe a url da imagem deste produto!
						</Form.Control.Feedback>
					</Form.Group>
				</Col>
			</Row>
			<Row className="mt-2 mb-2">
				<Col md={2}>
					<Button id="botao" type="submit" variant={props.modoEdicao ? "warning" : "success"}>
						{props.modoEdicao ? "Alterar" : "Confirmar"}
					</Button>
				</Col>
				<Col>
					<Button
						onClick={() => {
							props.setProdutoSelecionado(produtoReseta)
							props.setModoEdicao(false);
							props.setExibirProdutos(true);
						}}
						type="button"
						variant={props.modoEdicao ? "warning" : "success"}
					>
						Voltar
					</Button>
				</Col>
			</Row>
		</Form>
	);
}
