import { FormEvent, useState } from "react"
import { useNavigate } from "react-router-dom"
import { InviteGuestsModal } from "./invite-guests-modal"
import { ConfirmTripModal } from "./confirm-trip-modal"
import { DestinationAndDateStep } from "./steps/destination-and-date-step"
import { InviteGuestsStep } from "./invite-guests-step"
import { DateRange } from "react-day-picker"
import { api } from "../../lib/axios"

export function CreateTripPage() {
  const navigate = useNavigate()

  const [isGuestsInpoutOpen, setIsGuestsInputOpen] = useState(false)
  const [isGuestsModaltOpen, setIsGuestsModalOpen] = useState(false)
  const [isConfirmTripModaltOpen, setIsConfirmModalOpen] = useState(false)

  const [destination, setDestination] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [ownerEmail, setOwnerEmail] = useState('')
  const [eventStartAndDates, seteventStartAndDates] = useState<DateRange | undefined>()


  const [emailtoInvite, setEmailToInvide] = useState([
    'otaviopascoal2@gmail.com'
  ])

  function openGuestsInput() {
    setIsGuestsInputOpen(true)
  }

  function closeGuestsInput() {
    setIsGuestsInputOpen(false)
  }

  function OpenGuestsModal() {
    setIsGuestsModalOpen(true)
  }

  function closeGuestsModal() {
    setIsGuestsModalOpen(false)
  }

  function openConfirmTripModal() {
    setIsConfirmModalOpen(true)
  }

  function closeConfirmTripModal() {
    setIsConfirmModalOpen(false)
  }

  function addNewEmailToInvide(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const data = new FormData(event.currentTarget)
    const email = data.get('email')?.toString()

    if (!email) {
      return
    }

    if (emailtoInvite.includes(email)) {
      return
    }

    setEmailToInvide([
      ...emailtoInvite,
      email
    ])

    event.currentTarget.reset()
  }

  function removeEmailFromInvites(emailToRemove: string) {
    const newEmailList = emailtoInvite.filter(email => email !== emailToRemove)

    setEmailToInvide(newEmailList)
  }

  async function createTrip(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    
    console.log(destination)
    console.log(eventStartAndDates)
    console.log(emailtoInvite)
    console.log(ownerEmail)
    console.log(ownerName)

    if(!destination){
      return
    }

    if(!eventStartAndDates?.from || !eventStartAndDates?.to){
      return
    }

    if(emailtoInvite.length === 0){
      return
    }

    if(!ownerEmail || !ownerName){
      return
    }

    const response = await api.post('/trips', {
    destination,
    starts_at: eventStartAndDates?.from,
    ends_at: eventStartAndDates?.to,
    emails_to_invite: emailtoInvite,
    owner_name: ownerName,
    owner_email: ownerEmail
    })

    const { tripId } = response.data

    navigate(`/trips/${tripId}`)
  }

  return (
    <div className="h-screen flex items-center justify-center bg-pattern bg-no-repeat bg-center">
      <div className="max-w-3xl w-full px-6 text-center space-y-10">
        <div className=" flex flex-col items-center gap-3">
          <img src="/logo.svg" alt="plann.er" />
          <p className="text-zinc-300 text-lg ">Convide seus amigos e planeje sua próxima viagem!</p>
        </div>

        <div className="space-y-4">
          <DestinationAndDateStep
            closeGuestsInput={closeGuestsInput}
            isGuestsInpoutOpen={isGuestsInpoutOpen}
            openGuestsInput={openGuestsInput}
            setDestination={setDestination}
            eventStartAndDates={eventStartAndDates}
            seteventStartAndDates={seteventStartAndDates}
          />

          {isGuestsInpoutOpen && (
            <InviteGuestsStep
              OpenGuestsModal={OpenGuestsModal}
              emailtoInvite={emailtoInvite}
              openConfirmTripModal={openConfirmTripModal}
            />
          )
          }

        </div>
        <p className="text-sm text-zinc-500">
          Ao planejar sua viagem pela plann.er você automaticamente concorda<br />
          com nossos <a href="#" className="text-zinc-300 underline">termos de uso</a> <a href="#" className="text-zinc-300 underline">e políticas de privacidade.</a>
        </p>
      </div>

      {isGuestsModaltOpen && (
        <InviteGuestsModal
          addNewEmailToInvide={addNewEmailToInvide}
          closeGuestsModal={closeGuestsModal}
          emailtoInvite={emailtoInvite}
          removeEmailFromInvites={removeEmailFromInvites}
        />
      )}

      {isConfirmTripModaltOpen && (
        <ConfirmTripModal
          closeConfirmTripModal={closeConfirmTripModal}
          createTrip={createTrip}
          setOwnerName={setOwnerName}
          setOwnerEmail={setOwnerEmail}
        />
      )
      }
    </div>
  )
}

