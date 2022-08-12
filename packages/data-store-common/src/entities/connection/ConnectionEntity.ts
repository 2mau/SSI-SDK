import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm'
import { BaseConfigEntity } from './BaseConfigEntity'
import { ConnectionIdentifierEntity, connectionIdentifierEntityFrom } from './ConnectionIdentifierEntity'
import { MetadataItemEntity, metadataItemEntityFrom } from './MetadataItemEntity'
import { PartyEntity } from './PartyEntity'
import {
  BasicConnectionConfig,
  ConnectionTypeEnum,
  IBasicConnection,
  IBasicConnectionMetadataItem,
  IDidAuthConfig,
  IOpenIdConfig,
} from '../../types/connections'
import { openIdConfigEntityFrom } from './OpenIdConfigEntity'
import { didAuthConfigEntityFrom } from './DidAuthConfigEntity'
import { AbstractBaseEntity } from './AbstractBaseEntity'

@Entity('Connection')
export class ConnectionEntity extends AbstractBaseEntity {
  @Column('simple-enum', { nullable: false, enum: ConnectionTypeEnum })
  type!: ConnectionTypeEnum

  @OneToOne(() => ConnectionIdentifierEntity, { cascade: true })
  @JoinColumn()
  identifier!: ConnectionIdentifierEntity

  @OneToOne((type) => BaseConfigEntity, { cascade: true })
  @JoinColumn()
  config!: BaseConfigEntity

  @OneToMany(() => MetadataItemEntity, (metadata: MetadataItemEntity) => metadata.connection, { cascade: true, eager: true })
  @JoinColumn()
  metadata!: Array<MetadataItemEntity>

  @ManyToOne(() => PartyEntity, (party) => party.connections, {
    onDelete: 'CASCADE',
  })
  party!: PartyEntity
}

export const connectionEntityFrom = (connection: IBasicConnection): ConnectionEntity => {
  const connectionEntity = new ConnectionEntity()
  connectionEntity.type = connection.type
  connectionEntity.identifier = connectionIdentifierEntityFrom(connection.identifier)
  connectionEntity.config = configEntityFrom(connection.type, connection.config)
  connectionEntity.metadata = connection.metadata ? connection.metadata.map((item: IBasicConnectionMetadataItem) => metadataItemEntityFrom(item)) : []

  return connectionEntity
}

const configEntityFrom = (type: ConnectionTypeEnum, config: BasicConnectionConfig): BaseConfigEntity => {
  switch (type) {
    case ConnectionTypeEnum.OPENID:
      return openIdConfigEntityFrom(config as IOpenIdConfig)
    case ConnectionTypeEnum.DIDAUTH:
      return didAuthConfigEntityFrom(config as IDidAuthConfig)
    default:
      throw new Error('Connection type not supported')
  }
}
