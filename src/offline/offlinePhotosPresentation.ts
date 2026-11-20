type PhotosState = { ready: number; total: number; preparing: boolean; supported: boolean };

export function offlinePhotosPresentation({ ready, total, preparing, supported }: PhotosState) {
  const count = Number.isFinite(ready) ? Math.min(total, Math.max(0, Math.floor(ready))) : 0;
  const complete = supported && total > 0 && count === total && !preparing;
  return {
    complete,
    title: !supported ? "Preparação indisponível"
      : complete ? "Imagens preparadas"
        : preparing ? count === total ? "Conferindo imagens" : "Preparando imagens"
          : "Imagens pendentes",
    description: !supported ? "Não foi possível preparar as imagens nesta instalação."
      : complete ? "Fotos do perfil, veículo e estações disponíveis sem conexão neste dispositivo."
        : preparing ? "Mantenha o app aberto e conectado até concluir."
          : "Conecte-se e tente novamente para preparar as imagens que faltam.",
    canRetry: supported && !preparing && !complete,
  };
}
