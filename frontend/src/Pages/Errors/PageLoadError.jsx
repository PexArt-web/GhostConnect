import { useRouteError } from "react-router-dom"

const PageLoadError = () => {
    const error = useRouteError()
  return (
    <div>
      <h1>OOps!</h1>
      <p>{error.message} || Something went wrong </p>

    </div>
  )
}

export default PageLoadError
