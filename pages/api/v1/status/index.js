function status(request, response) {
  //response.status(200).send("alunos do curso.dev são pessoas acima da média");
  response.status(200).json({ chave: "média" });
}

export default status;
